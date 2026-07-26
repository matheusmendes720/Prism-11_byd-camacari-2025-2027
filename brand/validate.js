/**
 * Atlas Analytics — runtime palette validator
 *
 * Wraps `validate_palette.js` from the data-viz skill so the brand
 * spec's six checks can be re-run on every build (CI gate) against
 * the actual token values from theme.ts.
 *
 * Usage (Node):
 *   npx tsx brand/validate.ts                  # both modes
 *   npx tsx brand/validate.ts --mode dark      # single mode
 *
 * Usage (in CI):
 *   The script exits 1 on any FAIL (normal-vision floor < 15, off-band
 *   lightness, sub-chroma). WARNs exit 0 and are reported but do not
 *   fail the build — they are legal with secondary encoding.
 *
 * Required runtime: Node 18+, tsx (or compile + node).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ramp, status, surface, seriesHex } from "./theme.js";
const HERE = dirname(fileURLToPath(import.meta.url));
/** Locate the data-viz validator. Override via ATLAS_VALIDATOR env, or
 *  drop the script at one of the well-known relative locations. */
function findValidator() {
    const envPath = process.env.ATLAS_VALIDATOR;
    if (envPath && existsSync(envPath))
        return envPath;
    // Walk up the tree looking for validate_palette.js. The data-viz
    // skill ships it under scripts/. Search common dev locations.
    const searchRoots = [
        HERE,
        resolve(HERE, ".."),
        resolve(HERE, "..", ".."),
        resolve(HERE, "..", "..", ".."),
        resolve(HERE, "..", "..", "..", ".."),
        resolve(HERE, "..", "..", "vendor"),
        resolve(HERE, "vendor"),
    ];
    for (const root of searchRoots) {
        const candidates = [
            resolve(root, "scripts", "validate_palette.js"),
            resolve(root, "dataviz", "scripts", "validate_palette.js"),
            resolve(root, ".claude", "skills", "dataviz", "scripts", "validate_palette.js"),
        ];
        for (const p of candidates) {
            if (existsSync(p))
                return p;
        }
    }
    throw new Error("validate_palette.js not found. Set ATLAS_VALIDATOR=/path/to/validate_palette.js, " +
        "or copy validate_palette.js to ./scripts/ or ./vendor/scripts/.");
}
function runValidator(hexCsv, mode, surfaceHex, extraArgs = []) {
    const script = findValidator();
    const args = [script, hexCsv, "--mode", mode, "--surface", surfaceHex, ...extraArgs];
    const proc = spawnSync(process.execPath, args, { encoding: "utf8" });
    // The validator prints PASS/WARN/FAIL lines and exits 0 or 1.
    return {
        ok: proc.status === 0,
        report: parseReport(proc.stdout ?? ""),
    };
}
function parseReport(stdout) {
    // Extract the [PASS|WARN|FAIL] lines for tooling.
    const lines = stdout.split("\n").filter(l => /\[\w+\]/.test(l));
    return lines.map(line => {
        const m = line.match(/\[(\w+)\]\s+(\S.*?)\s{2,}(.+)/);
        if (!m)
            return { raw: line };
        return { state: m[1], name: m[2].trim(), detail: m[3].trim() };
    });
}
function categoricalHexList(mode) {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(s => seriesHex(s, mode));
}
function checkCategorical(mode) {
    const hexCsv = categoricalHexList(mode).join(",");
    return runValidator(hexCsv, mode, surface.chart[mode]);
}
function checkRamp(rampName, mode) {
    const steps = ramp[rampName][mode];
    return runValidator(steps.join(","), mode, surface.chart[mode], ["--ordinal"]);
}
function main() {
    const args = process.argv.slice(2);
    const onlyMode = args.includes("--mode")
        ? args[args.indexOf("--mode") + 1]
        : null;
    const modes = onlyMode ? [onlyMode] : ["light", "dark"];
    let allOk = true;
    for (const mode of modes) {
        console.log(`\n──── ${mode.toUpperCase()} MODE ────`);
        console.log("\nCategorical (8 slots):");
        const cat = checkCategorical(mode);
        console.log(`  ${cat.ok ? "OK" : "FAIL"} — worst adjacent ΔE check passed`);
        cat.report.forEach(r => console.log(`    ${JSON.stringify(r)}`));
        if (!cat.ok)
            allOk = false;
        for (const name of ["yellow", "red", "cyan"]) {
            console.log(`\nRamp ${name}:`);
            const r = checkRamp(name, mode);
            console.log(`  ${r.ok ? "OK" : "FAIL"}`);
            r.report.forEach(line => console.log(`    ${JSON.stringify(line)}`));
            if (!r.ok)
                allOk = false;
        }
    }
    // Status is fixed across modes; verify text contrast once.
    console.log("\n──── STATUS (mode-invariant) ────");
    for (const role of Object.keys(status)) {
        const hex = status[role];
        for (const mode of modes) {
            const r = runValidator(hex, mode, surface.chart[mode]);
            const line = `  ${role} (${hex}) on ${mode} → ${r.ok ? "PASS" : "WARN/FAIL"}`;
            console.log(line);
        }
    }
    console.log(`\n${"=".repeat(40)}\nAtlas theme: ${allOk ? "ALL CHECKS PASS ✓" : "SOME CHECKS FAILED ✗"}\n`);
    process.exit(allOk ? 0 : 1);
}
main();
