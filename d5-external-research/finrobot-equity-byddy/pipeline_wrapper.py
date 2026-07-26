#!/usr/bin/env python3
"""
pipeline_wrapper.py — D5 FinRobot equity pipeline wrapper for BYDDY.

Runs the 2-step FinRobot equity pipeline on BYDDY + peer set (TSLA/XPEV/LI/NIO)
and copies outputs into d5-external-research/finrobot-equity-byddy/.

Step 1: generate_financial_analysis.py
        → output/BYDDY/analysis/{financial_metrics_and_forecasts.csv,
                                   ratios_raw_data.csv, peer_ev_ebitda_comparison.csv}
        → output/BYDDY/analysis/{tagline, overview, investment_update,
                                   valuation, risks, competitor,
                                   takeaways, news}.txt (if --generate-text-sections)
        → optional: sensitivity, catalyst, enhanced_news

Step 2: create_equity_report.py
        → Professional_Equity_Report_BYDDY.html (5-page)
        → Combined_Equity_Report_BYDDY.html (master + sensitivity)
        → chart PNGs

DRY-RUN-aware: if config.ini or FMP/OpenAI keys missing → prints step-by-step
plan without calling APIs. LIVE otherwise.

Usage:
    .venv-finrobot/Scripts/python.exe pipeline_wrapper.py [--live|--dry-run]
"""

from __future__ import annotations

import os
import sys
import shutil
import argparse
import subprocess
import configparser
from pathlib import Path

PIPELINE_DIR = Path(__file__).parent.resolve()
# Hardcoded workspace paths — cross-platform reliable vs pathlib.parents quirks
WORKSPACE = Path(r"C:\Users\mathe\code_space\orchestration\economy-intel")
FINROBOT_SRC = WORKSPACE / "FinRobot" / "finrobot_equity" / "core" / "src"
CONFIG_INI = WORKSPACE / "FinRobot" / "finrobot_equity" / "core" / "config" / "config.ini"

TICKER = "BYDDY"
COMPANY_NAME = "BYD Company Limited"
PEER_TICKERS = ["TSLA", "XPEV", "LI", "NIO"]
GROWTH_2025 = 0.18  # BYD strong growth
GROWTH_2026 = 0.15
GROWTH_2027 = 0.12


def log(msg: str) -> None:
    print(f"[finrobot-pipeline] {msg}", flush=True)


def check_dependencies() -> bool:
    """Sanity-check that the venv has pandas, openai, etc."""
    try:
        import pandas  # noqa
        import openai  # noqa
        import yfinance  # noqa
        import numpy  # noqa
        log("✅ Dependencies present (pandas, openai, yfinance, numpy)")
        return True
    except ImportError as e:
        log(f"❌ Missing dependency: {e}")
        log("Run: .venv-finrobot/Scripts/python.exe -m pip install -r FinRobot/requirements-equity.txt")
        return False


def check_api_keys() -> dict:
    """Inspect config.ini for FMP + OpenAI keys. Returns dict of {key: present?}."""
    status = {"fmp_api_key": False, "openai_api_key": False, "config_exists": False}
    if not CONFIG_INI.exists():
        log(f"⚠️  Config not found at {CONFIG_INI}")
        log(f"   Copy from: {CONFIG_INI.with_suffix('.ini.example')}")
        return status
    status["config_exists"] = True
    cfg = configparser.ConfigParser()
    cfg.read(CONFIG_INI)
    if "API_KEYS" in cfg:
        status["fmp_api_key"] = bool(cfg["API_KEYS"].get("fmp_api_key", "").strip()) and \
            cfg["API_KEYS"]["fmp_api_key"] != "YOUR_FMP_API_KEY"
        status["openai_api_key"] = bool(cfg["API_KEYS"].get("openai_api_key", "").strip()) and \
            cfg["API_KEYS"]["openai_api_key"] != "YOUR_OPENAI_API_KEY"
    return status


def step1_generate_analysis(live: bool) -> int:
    """Step 1: generate_financial_analysis.py — produces CSVs + per-agent .txt files."""
    log("=" * 70)
    log(f"STEP 1 — generate_financial_analysis.py ({TICKER}, peers={PEER_TICKERS})")
    log("=" * 70)

    cmd = [
        sys.executable,
        str(FINROBOT_SRC / "generate_financial_analysis.py"),
        "--company-ticker", TICKER,
        "--company-name", COMPANY_NAME,
        "--config-file", str(CONFIG_INI) if CONFIG_INI.exists() else "",
        "--peer-tickers", *PEER_TICKERS,
        "--output-dir", str(PIPELINE_DIR / "output" / TICKER / "analysis"),
        "--revenue-growth-2025", str(GROWTH_2025),
        "--revenue-growth-2026", str(GROWTH_2026),
        "--revenue-growth-2027", str(GROWTH_2027),
    ]
    if live:
        cmd += ["--generate-text-sections",
                "--enable-sensitivity-analysis",
                "--enable-catalyst-analysis",
                "--enable-enhanced-news"]

    log("CMD: " + " ".join(cmd))
    if not live:
        log("DRY-RUN: skipping execution. Re-run with --live to invoke APIs.")
        return 0

    result = subprocess.run(cmd, cwd=str(FINROBOT_SRC))
    return result.returncode


def step2_create_report(live: bool) -> int:
    """Step 2: create_equity_report.py — assembles HTML + charts."""
    log("=" * 70)
    log(f"STEP 2 — create_equity_report.py (assemble HTML from step-1 outputs)")
    log("=" * 70)

    analysis_dir = PIPELINE_DIR / "output" / TICKER / "analysis"
    if not analysis_dir.exists():
        log(f"⚠️  Analysis dir missing: {analysis_dir}")
        log("Run step 1 first.")
        return 1

    # Walk the analysis dir to wire up file args
    files = {
        "analysis-csv": analysis_dir / "financial_metrics_and_forecasts.csv",
        "ratios-csv": analysis_dir / "ratios_raw_data.csv",
        "peer-ev-ebitda-csv": analysis_dir / "peer_ev_ebitda_comparison.csv",
        "tagline-file": analysis_dir / "tagline.txt",
        "overview-file": analysis_dir / "overview.txt",
        "investment-update-file": analysis_dir / "investment_update.txt",
        "valuation-file": analysis_dir / "valuation.txt",
        "risks-file": analysis_dir / "risks.txt",
        "competitor-file": analysis_dir / "competitor.txt",
        "takeaways-file": analysis_dir / "takeaways.txt",
        "news-file": analysis_dir / "news.txt",
    }
    cmd = [
        sys.executable,
        str(FINROBOT_SRC / "create_equity_report.py"),
        "--company-ticker", TICKER,
        "--company-name", COMPANY_NAME,
        "--output-dir", str(PIPELINE_DIR),
        "--config-file", str(CONFIG_INI) if CONFIG_INI.exists() else "",
    ]
    for arg, path in files.items():
        if path.exists():
            cmd += [f"--{arg}", str(path)]

    if live:
        cmd += ["--enable-text-regeneration", "--enable-valuation-analysis",
                "--enable-enhanced-charts"]

    log("CMD: " + " ".join(cmd))
    if not live:
        log("DRY-RUN: skipping execution. Re-run with --live to invoke APIs.")
        return 0

    result = subprocess.run(cmd, cwd=str(FINROBOT_SRC))
    return result.returncode


def copy_artifacts() -> int:
    """Copy the generated HTML into d5-external-research/finrobot-equity-byddy/."""
    log("=" * 70)
    log("STEP 3 — Copying artifacts into d5-external-research/finrobot-equity-byddy/")
    log("=" * 70)

    candidates = [
        PIPELINE_DIR / "Professional_Equity_Report_BYDDY.html",
        PIPELINE_DIR / "Combined_Equity_Report_BYDDY.html",
    ]
    copied = 0
    for f in candidates:
        if f.exists():
            log(f"  ✓ {f.name} ({f.stat().st_size / 1024:.1f} KB)")
            copied += 1
        else:
            log(f"  ⏳ {f.name} (not generated yet)")
    return copied


def main() -> int:
    parser = argparse.ArgumentParser(description="D5 FinRobot equity pipeline for BYDDY")
    parser.add_argument("--live", action="store_true", help="invoke APIs (default: dry-run)")
    parser.add_argument("--dry-run", action="store_true", help="plan only, no API calls")
    parser.add_argument("--skip-step1", action="store_true", help="skip generate_financial_analysis")
    parser.add_argument("--skip-step2", action="store_true", help="skip create_equity_report")
    args = parser.parse_args()

    if args.live and args.dry_run:
        log("ERROR: cannot set both --live and --dry-run")
        return 2

    live = args.live and not args.dry_run
    log(f"Mode: {'LIVE' if live else 'DRY-RUN'}")
    log(f"Python: {sys.executable}")
    log(f"FinRobot src: {FINROBOT_SRC}")
    log(f"Config ini: {CONFIG_INI}  ({'EXISTS' if CONFIG_INI.exists() else 'MISSING'})")

    if not check_dependencies():
        return 1

    keys = check_api_keys()
    log(f"API key status: {keys}")
    if live and not (keys["fmp_api_key"] and keys["openai_api_key"]):
        log("⚠️  LIVE mode requested but FMP/OpenAI keys missing → falling back to DRY-RUN")
        live = False

    rc = 0
    step1_skipped = False
    if not args.skip_step1:
        if not live:
            log("DRY-RUN: step 1 plan printed; outputs not generated.")
            step1_generate_analysis(False)  # prints CMD, does not invoke
            step1_skipped = True
        else:
            rc = step1_generate_analysis(live)
            if rc != 0:
                log(f"Step 1 failed (rc={rc}); aborting.")
                return rc
    else:
        step1_skipped = True

    if not args.skip_step2:
        if not live or step1_skipped:
            log("DRY-RUN (or step 1 skipped): step 2 plan printed; HTML not assembled.")
            step2_create_report(False)  # prints CMD, does not invoke
        else:
            rc = step2_create_report(live)
            if rc != 0:
                log(f"Step 2 failed (rc={rc}); aborting.")
                return rc

    if live:
        copy_artifacts()

    log("=" * 70)
    log("PIPELINE COMPLETE")
    log("=" * 70)
    log(f"Outputs: {PIPELINE_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())