/**
 * Atlas Analytics — design tokens
 * Generated against BRAND-SPEC.md v0.1.
 * Six checks per data-viz palette methodology: lightness band,
 * chroma floor, CVD separation, normal-vision floor, contrast,
 * documented palette.
 *
 * Usage:
 *   import { theme } from "./brand/theme";
 *   <div style={{ background: theme.color.surface[1].light }} />
 *   const slot = theme.color.series[2].hex;  // slot index 1..8
 */

export type Hex = `#${string}`;
export type Mode = "light" | "dark";

/** Categorical slot index (1..8). */
export type SeriesSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Sequential ramp step (relative — ramp-specific in semantic use). */
export type RampStep = 100 | 150 | 200 | 250 | 300 | 350 | 400 | 450 | 500 | 550 | 600 | 650 | 700;

/** Status role (reserved — never used for categorical identity). */
export type StatusRole = "good" | "warning" | "serious" | "critical";

// ── categorical (8 slots, fixed order) ───────────────────────────────────────
/**
 * Categorical hues. Slot index maps to data series order. The order is
 * the CVD-safety mechanism — do NOT re-order, do NOT cycle past slot 8.
 *
 * Light-mode slots 1, 3, 4, 6, 7 (yellow, cyan, amber, teal, orange)
 * sit below 3:1 contrast on the light surface by design — they MUST
 * be paired with a direct label or legend entry. Never place series
 * text on the fill; text wears `--ink-primary`, not the data color.
 *
 * Dark-mode slot 1↔2 (yellow↔red) sits in the CVD 6–8 floor band —
 * direct labels mandatory at this adjacency.
 */
export const series = {
  1: { name: "yellow",      light: "#eda100" as Hex, dark: "#c98500" as Hex },
  2: { name: "red",         light: "#dc2626" as Hex, dark: "#e34948" as Hex },
  3: { name: "cyan",        light: "#06b6d4" as Hex, dark: "#0891b2" as Hex },
  4: { name: "amber",       light: "#f59e0b" as Hex, dark: "#d97706" as Hex },
  5: { name: "violet",      light: "#7c3aed" as Hex, dark: "#7c3aed" as Hex },
  6: { name: "teal",        light: "#14b8a6" as Hex, dark: "#0d9488" as Hex },
  7: { name: "orange",      light: "#f97316" as Hex, dark: "#ea580c" as Hex },
  8: { name: "steel-blue",  light: "#0891b2" as Hex, dark: "#0369a1" as Hex },
} as const satisfies Record<SeriesSlot, { name: string; light: Hex; dark: Hex }>;

/** Get the hex for a series slot at the given mode. */
export const seriesHex = (slot: SeriesSlot, mode: Mode): Hex => series[slot][mode];

// ── sequential ramps ────────────────────────────────────────────────────────
/**
 * Single-hue ramps for magnitude encoding. Use ONE ramp per chart
 * (don't mix hue + lightness to encode two things at once).
 *
 * Yellow ramp: positive economic magnitude, exposure scoring.
 * Red ramp: severity, downside risk, vulnerability.
 * Cyan ramp: cool magnitude, neutral counts, distance.
 */
export const ramp = {
  yellow: {
    name: "yellow",
    light: ["#ca8a04", "#a16207", "#854d0e", "#422006"] as const,
    dark:  ["#eab308", "#ca8a04", "#a16207", "#854d0e"] as const,
  },
  red: {
    name: "red",
    light: ["#f87171", "#dc2626", "#b91c1c", "#991b1b"] as const,
    dark:  ["#fca5a5", "#ef4444", "#b91c1c", "#991b1b"] as const,
  },
  cyan: {
    name: "cyan",
    light: ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#083344"] as const,
    dark:  ["#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"] as const,
  },
} as const;

export type RampName = keyof typeof ramp;

// ── diverging pair ──────────────────────────────────────────────────────────
/**
 * Yellow ↔ Cyan diverging — the brand anchor vs the cool counter.
 * Midpoint is a neutral gray. Use for above/below baseline polarity.
 */
export const diverging = {
  yellow: { light: "#eab308" as Hex, dark: "#facc15" as Hex },
  cyan:   { light: "#06b6d4" as Hex, dark: "#67e8f9" as Hex },
  mid:    { light: "#f0efec" as Hex, dark: "#383835" as Hex },
} as const;

// ── status palette (fixed, never themed) ───────────────────────────────────
/**
 * Status colors carry meaning (good → critical), never identity.
 * Always ship with icon + label — never color alone. These steps are
 * deliberately distinct from categorical slots so a status color never
 * impersonates a series.
 */
export const status = {
  good:     "#0ca30c" as Hex,  // ✓ check
  warning:  "#fab219" as Hex,  // ⚠ triangle
  serious:  "#ec835a" as Hex,  // ◯ alert
  critical: "#d03b3b" as Hex,  // ✕ / ▲
} as const satisfies Record<StatusRole, Hex>;

// ── surfaces & ink ──────────────────────────────────────────────────────────
/**
 * Chart surface (where marks land) and page plane (around the chart).
 * Ink tokens — text always wears these, never the data color.
 */
export const surface = {
  chart: { light: "#fcfcfb" as Hex, dark: "#1a1a19" as Hex },  // surface-1
  page:  { light: "#f9f9f7" as Hex, dark: "#0d0d0d" as Hex },  // surface-2
} as const;

export const ink = {
  primary:   { light: "#0b0b0b" as Hex, dark: "#ffffff" as Hex },
  secondary: { light: "#52514e" as Hex, dark: "#c3c2b7" as Hex },
  muted:     { light: "#898781" as Hex, dark: "#898781" as Hex },  // axis ticks
  deltaGood: { light: "#006300" as Hex, dark: "#0ca30c" as Hex },
} as const;

export const chrome = {
  gridline: { light: "#e1e0d9" as Hex, dark: "#2c2c2a" as Hex },  // hairline, recessive
  baseline: { light: "#c3c2b7" as Hex, dark: "#383835" as Hex },  // axis line
  border:   {
    light: "rgba(11,11,11,0.10)" as const,
    dark:  "rgba(255,255,255,0.10)" as const,
  },
} as const;

// ── marks & anatomy (non-color specs that ship with the brand) ──────────────
/**
 * Fixed mark specs from the data-viz skill — reproduced here so the
 * tokens file is self-contained.
 *
 * NEVER draw a border around a mark to separate it. The gap and the
 * ring are the mechanism; a stroke adds data-weight ink.
 */
export const mark = {
  barThicknessMax: 24,        // px — cap it, never fill the slot
  barEndRadius:    4,         // px — rounded data-end, square baseline
  lineStroke:      2,         // px
  markerMin:       8,         // px diameter (r >= 4)
  surfaceGap:      2,         // px — between touching marks
  surfaceRing:     2,         // px — around markers
  areaOpacity:     0.10,      // wash, never saturated block
  gridlineWidth:   1,         // px — hairline, solid (never dashed)
} as const;

// ── aggregated theme object ────────────────────────────────────────────────
export const theme = {
  color: { series, ramp, diverging, status, surface, ink, chrome },
  mark,
  /** Bootstrap string for the CSS custom-property block. */
  toCssVariables(mode: Mode = "light"): string {
    const slots = Object.entries(series).map(([k, v]) =>
      `--series-${k}: ${v[mode]};`).join("\n  ");
    const rampLines = Object.entries(ramp).map(([name, r]) => {
      const steps = r[mode];
      return `--ramp-${name}-${steps.length}: ${steps.join(", ")};`;
    }).join("\n  ");
    return `:root {
  ${slots}
  ${rampLines}
  --status-good: ${status.good};
  --status-warning: ${status.warning};
  --status-serious: ${status.serious};
  --status-critical: ${status.critical};
  --surface-1: ${surface.chart[mode]};
  --surface-2: ${surface.page[mode]};
  --ink-primary: ${ink.primary[mode]};
  --ink-secondary: ${ink.secondary[mode]};
  --ink-muted: ${ink.muted[mode]};
  --delta-good: ${ink.deltaGood[mode]};
  --gridline: ${chrome.gridline[mode]};
  --baseline: ${chrome.baseline[mode]};
  --border: ${chrome.border[mode]};
}`;
  },
} as const;

// ── helper: pick the next categorical slot, never cycle past 8 ────────────
/**
 * Given a desired series count, return the slot indices to use. Past 8,
 * the caller MUST fold to "Other", small-multiples, or direct labels —
 * there is no 9th slot.
 */
export const slotIndicesFor = (count: number): SeriesSlot[] => {
  if (count < 1) return [];
  if (count > 8) {
    throw new Error(
      `Atlas theme has 8 categorical slots; requested ${count}. ` +
      `Fold to "Other", facet into small multiples, or use direct labels.`,
    );
  }
  return Array.from({ length: count }, (_, i) => (i + 1) as SeriesSlot);
};
