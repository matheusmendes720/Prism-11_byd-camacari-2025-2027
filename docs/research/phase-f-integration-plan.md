# Phase F Integration Plan — Energy Flow LP

Decision summary from taste-skill v2 verification. Three sections × Kling loop.

## Layering decision

**Keep 3 sections (Hero / Decisão / CTA), expand to a possible 4th (Prova) only if Phase F budget allows.**

Justification per section:

- **Hero** (current): R3F Canvas is the primary motivated hero (§7 3D coexistence); Kling is accent layer. §4.3 Anti-Center Bias + §10 Video/Media-Mask Hero support this combo. Keeps Hero asymmetric, not a centered text-over-video anti-pattern.
- **Decisão**: scroll-scrubbed Kling is the storytelling mechanism (§5 Motion Must Be Motivated + §5.B Horizontal-Pan canonical). Maps directly to "decisão" semantics — a timestamped revelation. Kling replaces a code-only reveal; justified.
- **CTA**: ambient Kling loop frames the final commitment (§5 state transition). One slow convergence, no scroll coupling. Justified.

Skip **Prova** for Phase F: logo wall + quote cards + metrics strip are copy-driven, not visual-velocity-driven. Adding a 4th Kling clip costs ~€25-40 of generation budget and would compete with Decisão's reveal (§9.F scroll-cue discipline — don't add more scrolling cues than the page can absorb). Revisit in Phase F.5 if Hero/Decisão/CTA land clean.

## Pattern decision

| Section | Pattern | Justification |
|---------|---------|---------------|
| Hero | Ambient (autoplay muted loop, no scroll coupling) | R3F owns scroll motion; Kling is a base-layer hum. Avoid double scroll coupling on Hero — two scrub systems thrash INP. |
| Decisão | Scroll-scrubbed (`useMotionValueEvent` writing to `videoRef.currentTime`) | Storytelling moments require timeline → progress (§3.B). No React state, no `window.scrollY`. |
| CTA | Ambient (slowest-fps, lowest-cost) | Page-trailing section; user focus is on CTA form / button, not the video. Reserved per §6.E DOM cost. |

## Variant count — 6 calls vs 3 calls

Recommendation: **3 generation calls total**, then bake a 0.5-1.0s freeze-frame start/end window so the loop joins cleanly.

Cost-benefit:

- A 2-variant per-clip budget would give one "safety" choice but doubles generation spend (Kling Tier S ≈ €15-25 per 10s 1080p render as of 2026-07). Across 3 sections × 2 variants = €90-150 budget, vs €45-75 for the 3-call plan.
- taste-skill v2 §1.B Use-Case Presets + §9.A anti-pattern catalog push the quality bar high enough that selection from a single render is realistic only when the prompt is exceptionally constrained. The 5-block prompt formula (§2 + §9 directives above) is conservative enough that a single well-constrained render typically matches the page's anti-default list.
- Roll back to 6 calls only for Hero if the first Hero render fails the per-clip color audit (e.g., model emits a purple tint that violates Lila). Decisão and CTA are lower-stakes; single render is fine.

## Kling prompt templates

The 3 full prompts (5-block formula from Artifact 1 §9). All use Motion Intensity 6, 16:9 master (Kling does not support 21:9 natively); Hero achieves 21:9 cinematic via CSS overlay (`aspect-ratio: 21/9` + `object-cover` zoom-crop in the HTML wrapper). No on-screen text in any video.

**CONSTRAINT DISCOVERED 2026-07-29**: No Kling model supports 21:9 aspect ratio (verified via `kling who_am_i` — only 16:9, 9:16, 1:1 across all 6 models). Hero achieves 21:9 cinematic feel via CSS overlay; the rendered video is 16:9, the wrapper crops top/bottom by ~12% to render in a 21:9 frame.

**PROMPT — Hero** (10s, 16:9, ambient loop, CSS letterbox to 21:9):

> Cinematic 16:9 master, minimum 1080p. A single modern electric sedan, three-quarter low-front view, carbon-fibre body, integrated headlight strip glowing energy-red, slowly dollying toward camera against a deep black studio floor with subtle reflection; no driver, no passengers, no plates, no people; one slow camera move (forward dolly), no subject motion; low-key cinematic grade, color palette restricted to deep dark void black, energy red, energy yellow, and metal-grade cream: no other hues; the only saturated accents permitted are energy red and energy yellow; muted ambient loop, 8s of motion plus 2s tail; no on-screen text, no subtitles, no captions, no version labels, no overlays, no locale strips, no stage labels, no decorative dots or pills, no logo, no border, no scroll cues, no fake UI mockup, no sparkles, no lens flare, no outer glow halo, no neon edges, no purple, no rainbow gradient, no em-dash characters, no fake charging-station HUD overlays; never break the dark-mode theme.

**PROMPT — Decisão** (12s, 16:9, scroll-scrubbed):

> Cinematic letterbox 16:9 master, minimum 1080p. A massive electric-vehicle battery cell factory interior, single robotic arm descending into frame from above holding a copper-wound stator, slow parallax right-to-left, deep black environment with one energy-yellow inspection lamp; no people, no signage, no on-screen text; one slow camera motion (right-to-left parallax), no subject motion (the arm locks at frame bottom); low-key cinematic grade, color palette restricted to deep dark void black, energy red, energy yellow, and metal-grade cream — no other hues; the only saturated accents permitted are energy red and energy yellow; ends with a slow zoom into the copper stator at 10-11s; scrubbable via scroll; no on-screen text, no subtitles, no captions, no version labels, no 'Brand · No. 01' overlays, no locale strips, no stage labels, no decorative dots or pills, no logo, no border-t or border-b on screen, no scroll cues, no fake UI mockup, no sparkles, no lens flare, no outer glow halo, no neon edges, no purple, no rainbow gradient, no em-dash characters; never break the dark-mode theme.

**PROMPT — CTA** (10s, 16:9, ambient loop, slowest):

> Cinematic letterbox 16:9 master, minimum 1080p. Convergence of three separate EV drivetrain components (a stator, an inverter, a tire) entering the same framed center from off-screen thirds, slow ambient merge, energy-red light bloom from behind at low intensity; no text, no people, no machine noise visible; one slow subject motion (the three pieces converge), no camera motion; low-key cinematic grade, color palette restricted to deep dark void black, energy red, energy yellow, and metal-grade cream — no other hues; the only saturated accents permitted are energy red and energy yellow; muted ambient loop, 8s of motion plus 2s tail; no on-screen text, no subtitles, no captions, no version labels, no 'Brand · No. 01' overlays, no locale strips, no stage labels, no decorative dots or pills, no logo, no border-t or border-b on screen, no scroll cues, no fake UI mockup, no sparkles, no lens flare, no outer glow halo, no neon edges, no purple, no rainbow gradient, no em-dash characters; never break the dark-mode theme.

## Model recommendation

- **Model**: Kling 3.0 (Tier S, 4k max, 3-15s) for Hero; Kling 3.0 Turbo (Tier A, 1080p max, 3-15s) for Decisão and CTA — the §1.B dial at 6/6/4 rewards a single Tier S hero and two Tier A accent clips.
- **Duration**: 10s for Hero, 12s for Decisão (scrubbing needs >= 8s of meaningful motion), 10s for CTA. Looped via `<video loop>` — Tailwind + Next does not need a re-render.
- **Resolution**: 1080p master for Hero and Decisão (1920 × 1080 source); 720p for CTA (1280 × 720). Encode to 720p H.265 MP4 for delivery; WebM as fallback.
- **Aspect ratio**: 16:9 on all three (Kling constraint). Hero achieves 21:9 cinematic feel via CSS `aspect-ratio: 21/9` on the wrapper + `object-cover` zoom-crop on the `<video>` element. Both 16:9 and 21:9 are taste-skill §3.E compliant (no `h-screen`).
- **Compression target**: Hero ≤ 500 KB, Decisão ≤ 400 KB, CTA ≤ 300 KB. Total ≤ 1.2 MB. If exceeded, drop to 720p on the heavier two clips before re-generating.
- **Fallback if Kling unavailable**: render a still 1920×1080 webp in Midnight Void + Energy Red light accent per section (next/image priority), apply §4.8 image-generation skill pipeline — never build a div-based faux-3D preview (§4.8).

## Failure modes

1. **Model generates on-screen text ("2026" or "BAHIA" labels) — violates §9.F.** Mitigation: extend the negative block at the prompt's tail with the explicit phrase "no on-screen alphanumeric characters of any kind, no version strings, no locale strings, no license-plate-shaped objects." If still present, fall back to a still webp with light grain texture overlay.

2. **Model drifts into purple/cool gradient or silver metallic — violates §4.2 Lila + Color Lock.** Mitigation: paste the color-LOCK positive clause verbatim after the lighting block in every prompt. On failure: run a second-generation pass with 1.3× emphasis on the word "energy-red" and the phrase "no other hues." If still off, fall back to a still image generated via imagegen-frontend-web with the brand tokens verified.

3. **Scroll-scrub on Decisão exceeds INP budget on mid-tier mobile (jank during scrub).** Mitigation: cap `dpr` on R3F Canvas to `[1, 1.2]`, use `frameloop="demand"`, write `videoRef.current.currentTime` only on `useMotionValueEvent`'s `requestAnimationFrame`-batched ticks, never via React state. Add a mobile-collapse to ambient mode below `md`. Add Lighthouse mobile budget check (§6.D) before declaring done.

Cross-cutting risk: copy-edit every PT-BR string for em-dash (`—`) and en-dash (`–`) characters before ship (§9.G). The single most-violated Tell, the easiest to miss.

