"""Fast offline audio generator using SAPI.SpVoice + SpFileStream via win32com.

OFFLINE FALLBACK — use ONLY when cloud TTS is unavailable.

When to use this script
------------------------
This is the offline audio fallback for the BYD Camaçari video project. Use it
whenever the primary (cloud) TTS path is blocked, e.g.:

* Edge TTS WebSocket closes mid-stream (rate-limit, network drop, proxy)
* ElevenLabs HTTP returns 402 (quota exhausted) or 429 (rate-limited)
* Other cloud TTS providers are unreachable from the build host

It is NOT the default. The default flow is `generate_audio.py` (cloud TTS).
This script exists so the project can still ship narration when the cloud is
down.

Requirements
------------
* Windows (uses SAPI5 via `win32com`)
* A Portuguese (Brazil) (`pt-BR`) SAPI5 voice installed — e.g. "Microsoft Maria
  Desktop" or "Brazilian Portuguese" from Windows Speech Pack. Run
  `python -c "import win32com.client; print(win32com.client.Dispatch('SAPI.SpVoice').GetVoices().Item(i).GetAttribute('Name'))"`
  for each index `i` to list available voices.
* `pywin32` (provides `win32com.client`): `pip install pywin32`
* `ffmpeg` on PATH (used to transcode SAPI 22kHz mono WAV → 96 kbps MP3)

Pipeline
--------
1. Parse `video/src/config.ts` and extract `audioPath` + `narration` per screen.
2. For each screen, synthesize the narration with SAPI.SpVoice at 22 kHz / 16-bit
   mono PCM (SAFT22kHz16BitMono, format code 22) directly to a WAV file via
   SAPI.SpFileStream. This bypasses pyttsx3's real-time playback wait — SAPI
   still produces audio at real-time, but we write it to disk in one pass and
   never block on the audio device.
3. Transcode each WAV → MP3 via ffmpeg (libmp3lame, 96 kbps, 24 kHz) into
   `video/public/audio/<screen>.mp3`.

Path resolution
---------------
Paths are computed relative to this script's location so it works no matter
where the repo is cloned:

    video/scripts/generate_audio_sapi.py  ←  __file__
    video/scripts/                        ←  parent
    video/                                ←  parent.parent
    case-studies/<this-case>/             ←  parent.parent.parent  (= ROOT)

So `ROOT = Path(__file__).resolve().parent.parent.parent`.

I/O contract
------------
Same as `generate_audio.py`:

* Input:  `video/src/config.ts`
* Output: `video/public/audio/*.mp3` (one per screen, basename from `audioPath`)
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

import win32com.client

# Resolve paths relative to this script so the file works from any cwd.
# __file__ is video/scripts/generate_audio_sapi.py, so .parent.parent.parent
# climbs to the case-study root (sibling of the `video/` directory).
ROOT = Path(__file__).resolve().parent.parent.parent
CONFIG_TS = ROOT / "video" / "src" / "config.ts"
AUDIO_DIR = ROOT / "video" / "public" / "audio"
TMP = Path(os.environ.get("TEMP", ".")) / "_byd_wav_sapi"

_SCREEN_OBJ_RE = re.compile(
    r"\{\s*id:\s*\"(?P<id>[^\"]+)\".*?\n\s*\},",
    re.DOTALL,
)
_FIELDS = {
    "audioPath": re.compile(r'audioPath:\s*"([^"]+)"'),
    "narration": re.compile(r'narration:\s*"((?:[^"\\]|\\.)*)"', re.DOTALL),
}


def _unescape(raw: str) -> str:
    return raw.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")


def parse_screens(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    out = []
    for m in _SCREEN_OBJ_RE.finditer(text):
        body = m.group(0)
        sid = m.group("id")
        a = _FIELDS["audioPath"].search(body)
        if not a:
            continue
        n = _FIELDS["narration"].search(body)
        if not n:
            raise ValueError(f"screen {sid} missing narration")
        out.append(
            {
                "id": sid,
                "audio_path": a.group(1),
                "narration": _unescape(n.group(1)),
            }
        )
    return out


def wav_to_mp3(in_wav: Path, out_mp3: Path) -> None:
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(in_wav),
        "-codec:a", "libmp3lame",
        "-b:a", "96k",
        "-ar", "24000",
        str(out_mp3),
    ]
    subprocess.run(cmd, check=True)


def synth_sapi(text: str, voice_token, rate: int, out_wav: Path) -> None:
    """Synthesize one narration to WAV via SAPI SpFileStream.

    rate in SAPI Speak rate units: -10..+10. +0 is neutral; -2 ~= 90% wpm.
    voice_token is an ISpeechObjectToken returned from ISpeechVoices.Item().
    """
    voice = win32com.client.Dispatch("SAPI.SpVoice")
    voice.Voice = voice_token
    voice.Rate = rate

    # 22kHz 16-bit mono PCM = SSFM 22.05kHz, 16bit, Mono
    fmt = win32com.client.Dispatch("SAPI.SpAudioFormat")
    fmt.Type = 22  # SAFT22kHz16BitMono

    stream = win32com.client.Dispatch("SAPI.SpFileStream")
    stream.Format = fmt
    stream.Open(str(out_wav), 3, False)  # 3 = SSFMCreateForWrite

    voice.AudioOutputStream = stream
    voice.Speak(text)
    stream.Close()


def main() -> int:
    screens = parse_screens(CONFIG_TS)
    if len(screens) != 8:
        print(f"[WARN] expected 8 screens, got {len(screens)}", file=sys.stderr)

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(exist_ok=True)

    # Find pt-BR voice via SAPI directly
    voice = win32com.client.Dispatch("SAPI.SpVoice")
    voices = voice.GetVoices()
    pt_token = None
    pt_name = None
    for i in range(voices.Count):
        v = voices.Item(i)
        info = v.GetAttribute("Name")
        try:
            desc = v.GetDescription()
        except Exception:
            desc = info
        if "pt-BR" in info or "Portuguese" in desc or "Brazil" in desc:
            pt_token = v
            pt_name = info
            print(f"[INFO] Using SAPI voice: {pt_name}")
            break
    if not pt_token:
        print("[FATAL] no pt-BR SAPI voice", file=sys.stderr)
        return 1

    rate = -2  # ~90% wpm; Edge used -5%, pyttsx3 used 175 (~neutral)
    written = []
    for i, s in enumerate(screens, 1):
        target = AUDIO_DIR / Path(s["audio_path"]).name
        wav = TMP / f"{s['id']}.wav"
        print(f"[{i}/8] {target.name}  (screen {s['id']}, {len(s['narration'])} chars)")
        try:
            synth_sapi(s["narration"], pt_token, rate, wav)
            wav_to_mp3(wav, target)
            size = target.stat().st_size
            print(f"      -> {size / 1024:.1f} KB")
            written.append(target)
        except Exception as exc:
            print(f"[ERROR] {s['id']}: {exc!r}", file=sys.stderr)
            raise

    print("")
    print("=" * 60)
    print(f"[INFO] Generated {len(written)} MP3 files")
    for p in written:
        size_kb = p.stat().st_size / 1024
        rel = p.relative_to(ROOT)
        print(f"  - {rel}  ({size_kb:.1f} KB)")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
