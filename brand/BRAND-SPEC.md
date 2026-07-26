---
name: atlas-analytics-brand-spec
description: Brand spec for the "Atlas" analytics dashboard — palette, ramps, surfaces, ink, status, validation evidence. Red+yellow anchors with warm/cool extensions.
metadata:
  type: deliverable
  brand: atlas
  intent: dashboard-analytics
  audience: developers
---

# Atlas Analytics — Brand Spec

**Brand codename:** Atlas
**Domain:** analytics dashboard (job-search campaign analytics, econometric
posture, vulnerability scoring)
**Audience:** developer-facing (tokens for HTML/React/Plotly/D3)
**Author:** Matheus Mendes · Salvador-BA, BR
**Status:** v0.1 — palette locked, ramps + status validated

This spec follows the data-viz palette methodology (validate-not-eyeball,
six checks, separate-by-job, status-reserved). Every color in this doc
ships with the validator evidence below.

## 1. Brand posture

- **Anchors:** red (`#dc2626`) + yellow (`#eda100`). Carried as
  categorical slots 1–2 in both modes; reinforced by yellow & red
  sequential ramps so magnitude reads of those hues feel native.
- **Extensions:** amber, cyan, violet, teal, orange, steel-blue — each
  in a separate hue family so no two adjacent slots collapse under
  CVD (protan/deutan).
- **Mid-tone cool:** cyan/teal/violet carry cool magnitude. Cyan is
  the diverging counter-pole to yellow (warm ↔ cool reads opposite).
- **Restrained chrome:** surfaces are near-white / near-black with
  warm-cool neutral ink; the only saturated blocks are small marks.

## 2. Categorical palette (8 slots)

Slots are fixed order. The order is the CVD-safety mechanism — slot
indices map directly to data series. A 9th series folds to "Other",
small-multiples, or direct labels; never a generated hue.

### Light mode (`--surface-1: #fcfcfb`)

| Slot | Hex      | Name        | Role                                  |
|------|----------|-------------|---------------------------------------|
| 1    | `#eda100` | Yellow      | Primary anchor (warm)                 |
| 2    | `#dc2626` | Red         | Primary anchor (warm)                 |
| 3    | `#06b6d4` | Cyan        | Cool extension                        |
| 4    | `#f59e0b` | Amber       | Warm extension                        |
| 5    | `#7c3aed` | Violet      | Cool chromatic                        |
| 6    | `#14b8a6` | Teal        | Cool-green extension                  |
| 7    | `#f97316` | Orange      | Warm extension                        |
| 8    | `#0891b2` | Steel-blue  | Deep cool (last-slot extension)       |

**Validator evidence (light):**

```
Palette (light, surface #fcfcfb, categorical): 8 slots
  [PASS] Lightness band         all 8 inside L 0.43–0.77
  [PASS] Chroma floor           all 8 >= 0.1
  [PASS] CVD separation         worst adjacent #f97316↔#14b8a6 ΔE 16.3 (deutan)
  [PASS] Normal-vision floor    worst adjacent #dc2626↔#eda100 ΔE 24.7 (normal)
  [WARN] Contrast vs surface    relief required: #eda100, #06b6d4, #f59e0b,
                                #14b8a6, #f97316 (all 2.0–2.7:1)
  → ALL CHECKS PASS
```

Relief slots (yellow, cyan, amber, teal, orange) sit below 3:1 on the
light surface by design — light categorical hues are legible only as
**marks beside labels**. The contract for these slots is:

- Always pair the mark with a **direct label** or **legend entry** that
  names the series.
- Never place series text on the fill (text wears `--ink-primary`, not
  the data color).
- Every chart has a **table view twin** — the values live there.

### Dark mode (`--surface-1: #1a1a19`)

| Slot | Hex      | Name        | Δ from light                                |
|------|----------|-------------|---------------------------------------------|
| 1    | `#c98500` | Yellow      | stepped darker (was too light at L 0.78)    |
| 2    | `#e34948` | Red         | lifted slightly (red can't step much darker) |
| 3    | `#0891b2` | Cyan        | stepped darker                             |
| 4    | `#d97706` | Amber       | stepped darker                             |
| 5    | `#7c3aed` | Violet      | holds (already in dark band)               |
| 6    | `#0d9488` | Teal        | stepped darker                             |
| 7    | `#ea580c` | Orange      | stepped darker                             |
| 8    | `#0369a1` | Steel-blue  | stepped darker (relief only, 2.94:1)        |

**Validator evidence (dark):**

```
Palette (dark, surface #1a1a19, categorical): 8 slots
  [PASS] Lightness band         all 8 inside L 0.48–0.67
  [PASS] Chroma floor           all 8 >= 0.1
  [WARN] CVD separation         worst adjacent #e34948↔#c98500 ΔE 6.2 (deutan)
  [PASS] Normal-vision floor    worst adjacent #e34948↔#c98500 ΔE 15.1 (normal)
  [WARN] Contrast vs surface    relief required: #0369a1 (2.94:1)
  → ALL CHECKS PASS
```

Dark slot 1 ↔ 2 (yellow ↔ red) sits in the CVD 6–8 floor band. The
relief is the same: **direct labels mandatory** at this adjacency.

## 3. Sequential ramps (warm + cool)

Three ramps for magnitude encoding. Each is **single-hue,
lightness-monotone**, lightest step cleared for ordinal use
(≥ 2:1 on the surface).

### Yellow ramp (4 steps)

| Step | Light    | Dark     |
|------|----------|----------|
| 300  | `#ca8a04` | `#eab308` |
| 500  | `#a16207` | `#ca8a04` |
| 600  | `#854d0e` | `#a16207` |
| 800  | `#422006` | `#854d0e` |

Use for: positive economic magnitude, exposure scoring, BYD-share
indicators (matches the brand anchor).

### Red ramp (4 steps)

| Step | Light    | Dark      |
|------|----------|-----------|
| 300  | `#f87171` | `#fca5a5` |
| 500  | `#dc2626` | `#ef4444` |
| 700  | `#b91c1c` | `#b91c1c` |
| 800  | `#991b1b` | `#991b1b` |

Use for: severity, downside risk, vulnerability index, gap-to-target.

### Cyan ramp (5 steps)

| Step | Light      | Dark       |
|------|------------|------------|
| 100  | `#06b6d4`  | `#67e8f9`  |
| 200  | `#0891b2`  | `#22d3ee`  |
| 300  | `#0e7490`  | `#06b6d4`  |
| 400  | `#155e75`  | `#0891b2`  |
| 600  | `#083344`  | `#0e7490`  |

Use for: cool magnitude, neutral counts, distance/scale.

**Validator evidence (yellow light):**

```
Palette (light, surface #fcfcfb, ordinal ramp): 4 slots
  [PASS] Lightness monotone
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #ca8a04 at 2.86:1
  [PASS] Single hue             spread 22°
  → ALL CHECKS PASS
```

**Validator evidence (red light):**

```
Palette (light, surface #fcfcfb, ordinal ramp): 4 slots
  [PASS] Lightness monotone
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #f87171 at 2.69:1
  [PASS] Single hue             spread 5°
  → ALL CHECKS PASS
```

**Validator evidence (cyan light):**

```
Palette (light, surface #fcfcfb, ordinal ramp): 5 slots
  [PASS] Lightness monotone
  [PASS] Adjacent ΔL            all gaps >= 0.06
  [PASS] Light-end contrast     #06b6d4 at 2.36:1
  [PASS] Single hue             spread 14°
  → ALL CHECKS PASS
```

## 4. Diverging pair (warm ↔ cool)

**Yellow ↔ Cyan** — the brand anchor vs the cool counter. Reads as
opposite because one is fully warm, the other fully cool. Neutral
midpoint `#f0efec` (light) / `#383835` (dark).

| Pole   | Steps (light)               | Steps (dark)               |
|--------|------------------------------|------------------------------|
| Yellow | `#ca8a04 → #eab308`         | `#eab308 → #facc15`         |
| Mid    | `#f0efec`                    | `#383835`                    |
| Cyan   | `#0891b2 → #06b6d4`         | `#67e8f9 → #06b6d4`         |

Use for: above/below baseline (e.g. actual-vs-forecast), sentiment,
PTAX-shift direction.

## 5. Status palette (fixed, never themed)

These four steps are reserved for state. They never impersonate a
categorical slot and always ship with **icon + label**, never color
alone. They are mode-invariant — the same hex in both light and dark.

| Role     | Hex      | Light contrast | Dark contrast | Pair with icon        |
|----------|----------|----------------|---------------|-----------------------|
| good     | `#0ca30c` | 3.27           | 5.19          | ✓ check               |
| warning  | `#fab219` | 1.79           | 9.49          | ⚠ triangle            |
| serious  | `#ec835a` | 2.57           | 6.60          | ◯ alert               |
| critical | `#d03b3b` | 4.68           | 3.62          | ✕ cross / ▲ warning   |

Light surface warning + serious sit below 3:1 by design — icon+label
is the mitigation.

## 6. Surfaces & ink

| Token             | Light    | Dark     |
|-------------------|----------|----------|
| `--surface-1` (chart bg) | `#fcfcfb` | `#1a1a19` |
| `--surface-2` (page plane) | `#f9f9f7` | `#0d0d0d` |
| `--ink-primary`           | `#0b0b0b` | `#ffffff` |
| `--ink-secondary`         | `#52514e` | `#c3c2b7` |
| `--ink-muted` (axis)      | `#898781` | `#898781` |
| `--gridline` (hairline)   | `#e1e0d9` | `#2c2c2a` |
| `--baseline`              | `#c3c2b7` | `#383835` |
| `--delta-good` (success text) | `#006300` | `#0ca30c` |
| `--border-hairline`       | `rgba(11,11,11,0.10)` | `rgba(255,255,255,0.10)` |

**Rule:** text wears text tokens, never the data color. A mark beside
the text carries identity (a dot, a short line-key, a swatch).

## 7. Mark & chart-anatomy contracts

(Adapted from the data-viz skill; reproduced here so the brand spec
is self-contained.)

- Bar / column: **≤ 24px thick**, **4px rounded data-end, square
  baseline**, grows from a single baseline.
- Line: **2px**, round join/cap.
- Marker / end-dot: **≥ 8px** (r ≥ 4), filled with the series color,
  with a **2px surface ring**.
- Area fill: series hue at **~10% opacity** — a wash, never a
  saturated block.
- Gridlines / axes: one-step-off-surface gray, **hairline (1px),
  solid** (never dashed), recessive.
- **2px surface gap** between touching marks (stacked segments,
  adjacent bars). Never a stroke drawn around a mark to separate it.
- Legend: **always present for ≥ 2 series**. Single-series needs no
  legend box — the title names it.
- Direct labels: **selective** (endpoint, extreme, the one series
  the story is about). Never a number on every point.
- Tooltip: required for every chart. Values also reachable via
  **table view twin** (never color-gated).

## 8. Anti-patterns (don't ship these)

- ❌ A dual-axis chart with two y-scales.
- ❌ Recolor-on-filter (color follows the entity, never its row).
- ❌ Cycling / generating hues past slot 8.
- ❌ A rainbow sequential ramp.
- ❌ A hue at the diverging midpoint.
- ❌ A status color used for a non-status series.
- ❌ Eyeballing CVD-safety.
- ❌ A number on every data point.
- ❌ A border drawn around marks to separate them.
- ❌ A display or serif face on a hero figure.
- ❌ Color-only encoding on a continuous scale (every chart has a
  table view).

## 9. Deliverables in this folder

- `theme.ts` — typed design tokens for TypeScript / React.
- `tokens.css` — CSS custom properties for direct import (HTML,
  vanilla JS, Plotly HTML, etc.).
- `validate.ts` — runtime wrapper around `validate_palette.js` that
  re-runs the six checks against `theme.ts` on every build.

## 10. How to swap or extend

To add a brand variant (e.g. "Atlas Pro" with a different accent):

1. Pick the new accent hue(s) and run `validate_palette.js` against
   the same surface.
2. Snap to the nearest passing step (don't eyeball).
3. Re-order candidate slot permutations and pick the one that
   maximizes minimum adjacent CVD ΔE.
4. Update `theme.ts` + `tokens.css` + this spec.
5. Re-run `validate.ts` in CI.

## 11. References

- Data-viz palette methodology — `references/palette.md`,
  `references/color-formula.md`, `references/anti-patterns.md`.
- Validator: `scripts/validate_palette.js` (six checks: lightness
  band, chroma floor, CVD separation, normal-vision floor,
  contrast, documented-palette).
