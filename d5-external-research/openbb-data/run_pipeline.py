#!/usr/bin/env python3
"""
run_pipeline.py — convenience wrapper to invoke pipeline_byd_camari.py
from the d5-external-research/openbb-data/ directory.

Handles:
  - locating pipeline_byd_camari.py (same dir)
  - setting PYTHONPATH for OpenBB venv (if poetry venv active)
  - friendly argparse UX
"""

from __future__ import annotations

import os
import sys
import subprocess
from pathlib import Path

PIPELINE_DIR = Path(__file__).parent.resolve()
PIPELINE_SCRIPT = PIPELINE_DIR / "pipeline_byd_camari.py"


def main() -> int:
    if not PIPELINE_SCRIPT.exists():
        print(f"ERROR: pipeline script not found at {PIPELINE_SCRIPT}")
        return 1

    # Invoke with same python interpreter
    cmd = [sys.executable, str(PIPELINE_SCRIPT), *sys.argv[1:]]
    print("CMD:", " ".join(cmd), flush=True)
    result = subprocess.run(cmd, cwd=str(PIPELINE_DIR))
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())