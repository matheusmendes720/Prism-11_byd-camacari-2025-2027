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
    1: { name: "yellow", light: "#eda100", dark: "#c98500" },
    2: { name: "red", light: "#dc2626", dark: "#e34948" },
    3: { name: "cyan", light: "#06b6d4", dark: "#0891b2" },
    4: { name: "amber", light: "#f59e0b", dark: "#d97706" },
    5: { name: "violet", light: "#7c3aed", dark: "#7c3aed" },
    6: { name: "teal", light: "#14b8a6", dark: "#0d9488" },
    7: { name: "orange", light: "#f97316", dark: "#ea580c" },
    8: { name: "steel-blue", light: "#0891b2", dark: "#0369a1" },
};
/** Get the hex for a series slot at the given mode. */
export const seriesHex = (slot, mode) => series[slot][mode];
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
        light: ["#ca8a04", "#a16207", "#854d0e", "#422006"],
        dark: ["#eab308", "#ca8a04", "#a16207", "#854d0e"],
    },
    red: {
        name: "red",
        light: ["#f87171", "#dc2626", "#b91c1c", "#991b1b"],
        dark: ["#fca5a5", "#ef4444", "#b91c1c", "#991b1b"],
    },
    cyan: {
        name: "cyan",
        light: ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#083344"],
        dark: ["#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"],
    },
};
// ── diverging pair ──────────────────────────────────────────────────────────
/**
 * Yellow ↔ Cyan diverging — the brand anchor vs the cool counter.
 * Midpoint is a neutral gray. Use for above/below baseline polarity.
 */
export const diverging = {
    yellow: { light: "#eab308", dark: "#facc15" },
    cyan: { light: "#06b6d4", dark: "#67e8f9" },
    mid: { light: "#f0efec", dark: "#383835" },
};
// ── status palette (fixed, never themed) ───────────────────────────────────
/**
 * Status colors carry meaning (good → critical), never identity.
 * Always ship with icon + label — never color alone. These steps are
 * deliberately distinct from categorical slots so a status color never
 * impersonates a series.
 */
export const status = {
    good: "#0ca30c", // ✓ check
    warning: "#fab219", // ⚠ triangle
    serious: "#ec835a", // ◯ alert
    critical: "#d03b3b", // ✕ / ▲
};
// ── surfaces & ink ──────────────────────────────────────────────────────────
/**
 * Chart surface (where marks land) and page plane (around the chart).
 * Ink tokens — text always wears these, never the data color.
 */
export const surface = {
    chart: { light: "#fcfcfb", dark: "#1a1a19" }, // surface-1
    page: { light: "#f9f9f7", dark: "#0d0d0d" }, // surface-2
};
export const ink = {
    primary: { light: "#0b0b0b", dark: "#ffffff" },
    secondary: { light: "#52514e", dark: "#c3c2b7" },
    muted: { light: "#898781", dark: "#898781" }, // axis ticks
    deltaGood: { light: "#006300", dark: "#0ca30c" },
};
export const chrome = {
    gridline: { light: "#e1e0d9", dark: "#2c2c2a" }, // hairline, recessive
    baseline: { light: "#c3c2b7", dark: "#383835" }, // axis line
    border: {
        light: "rgba(11,11,11,0.10)",
        dark: "rgba(255,255,255,0.10)",
    },
};
// ── marks & anatomy (non-color specs that ship with the brand) ──────────────
/**
 * Fixed mark specs from the data-viz skill — reproduced here so the
 * tokens file is self-contained.
 *
 * NEVER draw a border around a mark to separate it. The gap and the
 * ring are the mechanism; a stroke adds data-weight ink.
 */
export const mark = {
    barThicknessMax: 24, // px — cap it, never fill the slot
    barEndRadius: 4, // px — rounded data-end, square baseline
    lineStroke: 2, // px
    markerMin: 8, // px diameter (r >= 4)
    surfaceGap: 2, // px — between touching marks
    surfaceRing: 2, // px — around markers
    areaOpacity: 0.10, // wash, never saturated block
    gridlineWidth: 1, // px — hairline, solid (never dashed)
};
// ── aggregated theme object ────────────────────────────────────────────────
export const theme = {
    color: { series, ramp, diverging, status, surface, ink, chrome },
    mark,
    /** Bootstrap string for the CSS custom-property block. */
    toCssVariables(mode = "light") {
        const slots = Object.entries(series).map(([k, v]) => `--series-${k}: ${v[mode]};`).join("\n  ");
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
};
// ── helper: pick the next categorical slot, never cycle past 8 ────────────
/**
 * Given a desired series count, return the slot indices to use. Past 8,
 * the caller MUST fold to "Other", small-multiples, or direct labels —
 * there is no 9th slot.
 */
export const slotIndicesFor = (count) => {
    if (count < 1)
        return [];
    if (count > 8) {
        throw new Error(`Atlas theme has 8 categorical slots; requested ${count}. ` +
            `Fold to "Other", facet into small multiples, or use direct labels.`);
    }
    return Array.from({ length: count }, (_, i) => (i + 1));
};
