"""
StockIQ — Institutional Equity Research CLI Runner
==================================================
Usage:
  python run_research.py --ticker RELIANCE.NS
  python run_research.py --ticker TCS --email myemail@gmail.com
  python run_research.py --ticker AAPL --email user@example.com
"""

import sys
import os
import argparse
import asyncio
from pathlib import Path

# Force UTF-8 stdout on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.services.institutional_pipeline import InstitutionalPipeline


async def main():
    parser = argparse.ArgumentParser(description="StockIQ Institutional AI Equity Research Engine")
    parser.add_argument("--ticker", "-t", type=str, required=True, help="Stock ticker (e.g. RELIANCE, TCS.NS, TATAMOTORS, AAPL)")
    parser.add_argument("--email", "-e", type=str, default="", help="Recipient email address to automatically send the PDF research report")
    parser.add_argument("--output", "-o", type=str, default="", help="Custom output path for the generated PDF memo")

    args = parser.parse_args()

    print("\n" + "="*70)
    print(" [*] STOCKIQ INSTITUTIONAL EQUITY RESEARCH ENGINE (BUFFETT/MUNGER)")
    print("="*70)
    print(f" >> Stock Ticker      : {args.ticker.upper()}")
    if args.email:
        print(f" >> Email Delivery    : {args.email}")
    print("="*70 + "\n")

    pipeline = InstitutionalPipeline()
    print(" [1/5] Harvesting 10-Yr Financial Statements, Ratios & Statements...")
    print(" [2/5] Running Forensic Algorithms (DuPont, Working Capital, 3-Scenario DCF)...")
    print(" [3/5] Scanning Exchange Disclosures, Contracts & Recent Corporate News...")
    print(" [4/5] Executing Institutional AI Analysis (Moat, Management, Catalysts, Kill Thesis)...")

    result = await pipeline.run_full_research(
        ticker=args.ticker,
        recipient_email=args.email if args.email else None,
        save_pdf_path=args.output if args.output else None
    )

    print("\n" + "="*70)
    print(" [SUCCESS] 2-VOLUME RESEARCH MEMO GENERATED SUCCESSFULLY!")
    print("="*70)
    print(f" * Company Name       : {result.get('company_name')}")
    print(f" * Current Price      : Rs. {result.get('fundamentals', {}).get('current_price')}")
    dcf = result.get('forensics', {}).get('dcf', {})
    print(f" * DCF Base Fair Value: Rs. {dcf.get('base_case', {}).get('fair_value')} (Margin of Safety: {dcf.get('margin_of_safety_pct')}%)")
    print(f" * Valuation Stance   : {dcf.get('valuation_verdict')}")
    
    bv = result.get('buffett_verdict', {})
    print(f" * BUFFETT VERDICT    : >>> {bv.get('verdict', 'BUY_WITH_MARGIN_OF_SAFETY')} <<<")
    print(f" * Volume 1 (PDF)     : {result.get('pdf_volume1_path')}")
    print(f" * Volume 2 (PDF)     : {result.get('pdf_volume2_path')}")

    if args.email:
        email_res = result.get("email_dispatch", {})
        if email_res and email_res.get("success"):
            print(f" * Email Dispatch     : SENT BOTH PDFs to {args.email}")
        else:
            print(f" * Email Dispatch     : {email_res.get('error') if email_res else 'Not sent'}")

    print("\n" + "="*70)
    print(" [WARREN BUFFETT / OMAHA ASSESSMENT]")
    print("="*70)
    print(bv.get('omaha_reasoning', ''))
    print("="*70 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
