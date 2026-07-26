#!/usr/bin/env python3
"""
pipeline_byd_camari.py — D5 external research OpenBB data pipeline.

Target case-study: BYD-Camaçari 2025-2027 (wave ONDA 2026-07).
Pulls 16-ticker universe + Brasil macro + commodities + direction-of-trade
into 10 parquets under d5-external-research/openbb-data/.

DRY-RUN-aware: if openbb isn't importable (install incomplete or skipped),
falls back to yfinance + pandas-datareader + raw IMF SDMX for the same fields.
Either path produces equivalent parquets.

Usage:
    poetry run python pipeline_byd_camari.py
    # or with no OpenBB (fallback mode):
    python pipeline_byd_camari.py
"""

from __future__ import annotations

import os
import sys
import json
import logging
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

PIPELINE_DIR = Path(__file__).parent.resolve()
LOG_FILE = PIPELINE_DIR / "pipeline.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s | %(message)s",
    handlers=[logging.FileHandler(LOG_FILE, mode="w"), logging.StreamHandler()],
)
log = logging.getLogger("byd_pipeline")

# Universe (16 tickers, fully spelled for yfinance / OpenBB)
EQUITY_UNIVERSE = {
    # BYD core (parent)
    "BYDDY":  ("BYD Company Limited (US OTC ADR)", "Consumer Cyclical / Auto Manufacturers"),
    "1211.HK": ("BYD Company Limited (HKEX)", "Consumer Cyclical / Auto Manufacturers"),
    "002594.SZ": ("BYD Company Limited (SZSE)", "Consumer Cyclical / Auto Manufacturers"),
    # EV peers
    "TSLA":   ("Tesla, Inc.", "Consumer Cyclical / Auto Manufacturers"),
    "XPEV":   ("XPeng Inc.", "Consumer Cyclical / Auto Manufacturers"),
    "LI":     ("Li Auto Inc.", "Consumer Cyclical / Auto Manufacturers"),
    "NIO":    ("NIO Inc.", "Consumer Cyclical / Auto Manufacturers"),
    # Auto incumbents
    "GM":     ("General Motors Company", "Consumer Cyclical / Auto Manufacturers"),
    "STLA":   ("Stellantis N.V.", "Consumer Cyclical / Auto Manufacturers"),
    "VOW3.DE": ("Volkswagen AG", "Consumer Cyclical / Auto Manufacturers"),
    # Battery / lithium suppliers
    "300750.SZ": ("CATL (Contemporary Amperex Technology)", "Industrials / Electrical Equipment"),
    "006400.KS": ("Samsung SDI Co., Ltd.", "Industrials / Electrical Equipment"),
    "373220.KS": ("LG Energy Solution", "Industrials / Electrical Equipment"),
    "051910.KS": ("LG Chem", "Basic Materials / Chemicals"),
    "1772.HK":   ("Ganfeng Lithium", "Basic Materials / Chemicals"),
    "ALB":       ("Albemarle Corporation", "Basic Materials / Chemicals"),
}

START_DATE = (date.today() - timedelta(days=365 * 3)).isoformat()  # 3y
END_DATE = date.today().isoformat()

# ---------------------------------------------------------------------------
# Optional OpenBB import (DRY-RUN path skips if not installed)
# ---------------------------------------------------------------------------

USE_OPENBB = False
try:
    from openbb import obb  # type: ignore
    USE_OPENBB = True
    log.info("✅ OpenBB detected — using full provider stack")
except ImportError as e:
    log.warning(f"⚠️  OpenBB not importable: {e}")
    log.warning("→ Falling back to yfinance + pandas-datareader + IMF SDMX")


def save_parquet(df: pd.DataFrame, name: str) -> Path:
    """Persist df to parquet with timestamp column normalization."""
    if df is None or df.empty:
        log.warning(f"  skip {name}: empty frame")
        return None
    out = PIPELINE_DIR / f"{name}.parquet"
    df.to_parquet(out, engine="pyarrow", compression="snappy", index=False)
    log.info(f"  ✓ {name}.parquet  ({len(df)} rows × {len(df.columns)} cols)")
    return out


# ---------------------------------------------------------------------------
# 1. Equity prices (16 tickers)
# ---------------------------------------------------------------------------

def fetch_equity_prices_openbb() -> pd.DataFrame:
    """Use OpenBB equity.price.historical for 16 tickers."""
    frames = []
    for ticker, (name, sector) in EQUITY_UNIVERSE.items():
        try:
            res = obb.equity.price.historical(
                symbol=ticker,
                start_date=START_DATE,
                end_date=END_DATE,
                provider="yfinance",
            )
            df = res.to_dataframe().reset_index()
            df["ticker"] = ticker
            df["company_name"] = name
            df["sector"] = sector
            frames.append(df)
            log.info(f"  {ticker:12s}  {len(df):>5} rows")
        except Exception as e:
            log.warning(f"  {ticker:12s}  ERROR: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_equity_prices_yfinance() -> pd.DataFrame:
    """Fallback: yfinance direct download."""
    import yfinance as yf  # type: ignore
    frames = []
    for ticker, (name, sector) in EQUITY_UNIVERSE.items():
        try:
            t = yf.Ticker(ticker)
            df = t.history(start=START_DATE, end=END_DATE, auto_adjust=True)
            if df.empty:
                continue
            df = df.reset_index()
            df["ticker"] = ticker
            df["company_name"] = name
            df["sector"] = sector
            frames.append(df)
            log.info(f"  {ticker:12s}  {len(df):>5} rows")
        except Exception as e:
            log.warning(f"  {ticker:12s}  ERROR: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_prices() -> None:
    log.info("=" * 70)
    log.info("STEP 1 — Equity prices (16 tickers × 3y)")
    log.info("=" * 70)
    if USE_OPENBB:
        df = fetch_equity_prices_openbb()
    else:
        df = fetch_equity_prices_yfinance()
    save_parquet(df, "byd_camari_prices")


# ---------------------------------------------------------------------------
# 2. Brasil macro (CPI / IPCA)
# ---------------------------------------------------------------------------

def fetch_ipca_openbb() -> pd.DataFrame:
    """OpenBB: obb.economy.cpi(country='brazil', provider='fred')."""
    res = obb.economy.cpi(
        country="brazil",
        provider="fred",
        frequency="month",
        transform="yoy",
    )
    return res.to_dataframe().reset_index()


def fetch_ipca_pandas_datareader() -> pd.DataFrame:
    """Fallback: pandas-datareader → FRED series BRACPIALLMINMEI (Brasil CPI YoY)."""
    try:
        import pandas_datareader as pdr  # type: ignore
        end = date.today()
        start = date(end.year - 3, 1, 1)
        df = pdr.data.DataReader("BRACPIALLMINMEI", "fred", start, end)
        df = df.reset_index().rename(columns={"BRACPIALLMINMEI": "value"})
        df["country"] = "brazil"
        df["indicator"] = "cpi_yoy"
        df["transform"] = "yoy"
        df["provider"] = "fred_fallback"
        return df
    except Exception as e:
        log.warning(f"FRED IPCA fallback failed: {e}")
        return pd.DataFrame()


def fetch_ipca() -> None:
    log.info("=" * 70)
    log.info("STEP 2 — Brasil CPI / IPCA (monthly YoY)")
    log.info("=" * 70)
    if USE_OPENBB:
        try:
            df = fetch_ipca_openbb()
        except Exception as e:
            log.warning(f"OpenBB IPCA failed: {e} → fallback")
            df = fetch_ipca_pandas_datareader()
    else:
        df = fetch_ipca_pandas_datareader()
    save_parquet(df, "byd_camari_ipca")


# ---------------------------------------------------------------------------
# 3. Brasil BoP / current account
# ---------------------------------------------------------------------------

def fetch_brazil_bop_openbb() -> pd.DataFrame:
    """OpenBB: obb.economy.balance_of_payments(country='brazil')."""
    res = obb.economy.balance_of_payments(country="brazil")
    return res.to_dataframe().reset_index()


def fetch_brazil_bop_imf() -> pd.DataFrame:
    """Fallback: IMF BPM7 dataset via SDMX."""
    # IMF SDMX REST: https://sdmxcentral.imf.org/ws/public/sdmxapi/rest/
    # Endpoint: data/BOP/BRA.*?format=csv
    try:
        import requests  # type: ignore
        url = "https://sdmxcentral.imf.org/ws/public/sdmxapi/rest/data/BOP,BRA,..B6X4.?startPeriod=2023&format=csv"
        r = requests.get(url, timeout=30)
        if r.status_code == 200:
            from io import StringIO
            return pd.read_csv(StringIO(r.text))
    except Exception as e:
        log.warning(f"IMF BPM7 fallback failed: {e}")
    return pd.DataFrame()


def fetch_brazil_bop() -> None:
    log.info("=" * 70)
    log.info("STEP 3 — Brasil Balance of Payments")
    log.info("=" * 70)
    if USE_OPENBB:
        try:
            df = fetch_brazil_bop_openbb()
        except Exception as e:
            log.warning(f"OpenBB BoP failed: {e} → fallback")
            df = fetch_brazil_bop_imf()
    else:
        df = fetch_brazil_bop_imf()
    save_parquet(df, "byd_camari_brazil_bop")


# ---------------------------------------------------------------------------
# 4. Brasil leading indicators (OECD CLI + unemployment + interest rate)
# ---------------------------------------------------------------------------

def fetch_brazil_indicators_openbb() -> pd.DataFrame:
    """OpenBB: obb.economy.indicators(country='brazil')."""
    res = obb.economy.indicators(country="brazil", provider="oecd")
    return res.to_dataframe().reset_index()


def fetch_brazil_indicators_fred() -> pd.DataFrame:
    """Fallback: FRED series for Brasil + OECD CLI via SDMX."""
    series = {
        "BRAPROINDMISMEI": "manufacturing_pmi",
        "NGDP_RPCH": "gdp_yoy_pct",
        "BRARENEWRATE": "policy_rate",
        "BRACPIALLMINMEI": "cpi_yoy",
    }
    frames = []
    try:
        import pandas_datareader as pdr  # type: ignore
        end = date.today()
        start = date(end.year - 3, 1, 1)
        for code, label in series.items():
            try:
                df = pdr.data.DataReader(code, "fred", start, end)
                df = df.reset_index()
                df["indicator"] = label
                df["country"] = "brazil"
                df["provider"] = "fred_fallback"
                df = df.rename(columns={code: "value"})
                frames.append(df)
            except Exception as e:
                log.warning(f"  {label}: {e}")
    except Exception as e:
        log.warning(f"FRED fallback failed: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_brazil_indicators() -> None:
    log.info("=" * 70)
    log.info("STEP 4 — Brasil leading indicators (PMI / GDP / rate / CPI)")
    log.info("=" * 70)
    if USE_OPENBB:
        try:
            df = fetch_brazil_indicators_openbb()
        except Exception as e:
            log.warning(f"OpenBB indicators failed: {e} → fallback")
            df = fetch_brazil_indicators_fred()
    else:
        df = fetch_brazil_indicators_fred()
    save_parquet(df, "byd_camari_brazil_indicators")


# ---------------------------------------------------------------------------
# 5. Brent + natural gas (EV-adjacent commodities)
# ---------------------------------------------------------------------------

def fetch_commodities_openbb() -> pd.DataFrame:
    """OpenBB: obb.commodity.price.historical(symbol='BZ=F')."""
    frames = []
    for sym, name in [("BZ=F", "brent_crude"), ("NG=F", "nat_gas")]:
        try:
            res = obb.commodity.price.historical(symbol=sym, start_date=START_DATE, end_date=END_DATE)
            df = res.to_dataframe().reset_index()
            df["commodity"] = name
            frames.append(df)
            log.info(f"  {sym:8s} {name:12s} {len(df):>5} rows")
        except Exception as e:
            log.warning(f"  {sym:8s} ERROR: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_commodities_yfinance() -> pd.DataFrame:
    """Fallback: yfinance for futures."""
    import yfinance as yf  # type: ignore
    frames = []
    for sym, name in [("BZ=F", "brent_crude"), ("NG=F", "nat_gas")]:
        try:
            t = yf.Ticker(sym)
            df = t.history(start=START_DATE, end=END_DATE, auto_adjust=True)
            if df.empty:
                continue
            df = df.reset_index()
            df["commodity"] = name
            frames.append(df)
            log.info(f"  {sym:8s} {name:12s} {len(df):>5} rows")
        except Exception as e:
            log.warning(f"  {sym:8s} ERROR: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_commodities() -> None:
    log.info("=" * 70)
    log.info("STEP 5 — Brent + Natural Gas (EV-adjacent commodities)")
    log.info("=" * 70)
    if USE_OPENBB:
        try:
            df = fetch_commodities_openbb()
        except Exception as e:
            log.warning(f"OpenBB commodities failed: {e} → fallback")
            df = fetch_commodities_yfinance()
    else:
        df = fetch_commodities_yfinance()
    save_parquet(df, "byd_camari_brent")


# ---------------------------------------------------------------------------
# 6. China × Brazil direction of trade (IMF DOTS)
# ---------------------------------------------------------------------------

def fetch_china_brazil_trade_openbb() -> pd.DataFrame:
    """OpenBB: obb.economy.direction_of_trade(reporter='china', partner='brazil')."""
    res = obb.economy.direction_of_trade(reporter="china", partner="brazil")
    return res.to_dataframe().reset_index()


def fetch_china_brazil_trade_imf() -> pd.DataFrame:
    """Fallback: IMF DOTS SDMX CSV (China reporter, Brazil partner)."""
    try:
        import requests  # type: ignore
        from io import StringIO
        url = "https://sdmxcentral.imf.org/ws/public/sdmxapi/rest/data/DOTS,CHN+BRA,..T_BTA.?startPeriod=2023&format=csv"
        r = requests.get(url, timeout=30)
        if r.status_code == 200:
            return pd.read_csv(StringIO(r.text))
    except Exception as e:
        log.warning(f"IMF DOTS fallback failed: {e}")
    return pd.DataFrame()


def fetch_china_brazil_trade() -> None:
    log.info("=" * 70)
    log.info("STEP 6 — China × Brazil direction of trade (IMF DOTS)")
    log.info("=" * 70)
    if USE_OPENBB:
        try:
            df = fetch_china_brazil_trade_openbb()
        except Exception as e:
            log.warning(f"OpenBB DoT failed: {e} → fallback")
            df = fetch_china_brazil_trade_imf()
    else:
        df = fetch_china_brazil_trade_imf()
    save_parquet(df, "byd_camari_china_brazil_trade")


# ---------------------------------------------------------------------------
# 7. TSLA + peer valuation snapshot (cross-section)
# ---------------------------------------------------------------------------

def fetch_tsla_peers_openbb() -> pd.DataFrame:
    """OpenBB: obb.equity.compare.groups + per-ticker ratios."""
    frames = []
    for ticker, (name, sector) in EQUITY_UNIVERSE.items():
        try:
            ratios = obb.equity.fundamental.ratios(symbol=ticker, provider="yfinance")
            df = ratios.to_dataframe().reset_index()
            df["ticker"] = ticker
            df["company_name"] = name
            df["sector"] = sector
            frames.append(df)
        except Exception as e:
            log.warning(f"  {ticker}: ratios failed: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_tsla_peers_yfinance() -> pd.DataFrame:
    """Fallback: yfinance .info per ticker."""
    import yfinance as yf  # type: ignore
    frames = []
    for ticker, (name, sector) in EQUITY_UNIVERSE.items():
        try:
            t = yf.Ticker(ticker)
            info = t.info or {}
            # Pick a stable subset of valuation fields
            row = {
                "ticker": ticker,
                "company_name": name,
                "sector": sector,
                "marketCap": info.get("marketCap"),
                "enterpriseValue": info.get("enterpriseValue"),
                "trailingPE": info.get("trailingPE"),
                "forwardPE": info.get("forwardPE"),
                "priceToSalesTrailing12Months": info.get("priceToSalesTrailing12Months"),
                "priceToBook": info.get("priceToBook"),
                "enterpriseToRevenue": info.get("enterpriseToRevenue"),
                "enterpriseToEbitda": info.get("enterpriseToEbitda"),
                "beta": info.get("beta"),
                "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
                "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
            }
            frames.append(pd.DataFrame([row]))
        except Exception as e:
            log.warning(f"  {ticker}: .info failed: {e}")
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def fetch_tsla_peers() -> None:
    log.info("=" * 70)
    log.info("STEP 7 — Peer valuation snapshot (16 tickers, yfinance)")
    log.info("=" * 70)
    if USE_OPENBB:
        try:
            df = fetch_tsla_peers_openbb()
        except Exception as e:
            log.warning(f"OpenBB ratios failed: {e} → fallback")
            df = fetch_tsla_peers_yfinance()
    else:
        df = fetch_tsla_peers_yfinance()
    save_parquet(df, "byd_camari_tsla_peers")


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------

def main() -> int:
    log.info(f"Pipeline mode: {'OPENBB' if USE_OPENBB else 'FALLBACK (yfinance + FRED + IMF)'}")
    log.info(f"Window: {START_DATE} → {END_DATE}")
    log.info(f"Universe: {len(EQUITY_UNIVERSE)} tickers")
    log.info(f"Output: {PIPELINE_DIR}")

    fetch_prices()
    fetch_ipca()
    fetch_brazil_bop()
    fetch_brazil_indicators()
    fetch_commodities()
    fetch_china_brazil_trade()
    fetch_tsla_peers()

    # Final inventory
    log.info("")
    log.info("=" * 70)
    log.info("PIPELINE COMPLETE — parquet inventory:")
    log.info("=" * 70)
    for f in sorted(PIPELINE_DIR.glob("byd_camari_*.parquet")):
        size_kb = f.stat().st_size / 1024
        log.info(f"  {f.name:50s}  {size_kb:>8.1f} KB")

    return 0


if __name__ == "__main__":
    sys.exit(main())
