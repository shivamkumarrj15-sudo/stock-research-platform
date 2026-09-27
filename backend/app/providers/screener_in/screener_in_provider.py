"""
Screener.in Data Provider Implementation
=======================================
Extracts:
1. Top Ratios & Valuation metrics
2. Full 10-Year Profit & Loss Statement (Sales, EBITDA, PAT, EPS)
3. Full 10-Year Balance Sheet (Borrowings, Assets, Equity, Reserves)
4. Full 10-Year Cash Flow Statement (CFO, CFI, CFF, Net Cash Flow)
5. Shareholding Pattern & Promoter Pledge Trends
6. Pros & Cons, Compound Growth Tables
"""

import urllib.request
import asyncio
import re
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)


class ScreenerInProvider:
    def __init__(self, session_id: str = ""):
        self.session_id = session_id or "M2kJ4HCo4oqev2hDQoaCqrxZeAvQ6ZBb"
        self.is_authenticated = bool(self.session_id)

    def set_session_id(self, session_id: str):
        self.session_id = session_id.strip()
        self.is_authenticated = bool(self.session_id)

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        if self.session_id:
            headers["Cookie"] = f"sessionid={self.session_id};"
        return headers

    def _sync_fetch_url(self, url: str) -> Optional[str]:
        req = urllib.request.Request(url, headers=self._get_headers())
        try:
            with urllib.request.urlopen(req, timeout=14) as res:
                return res.read().decode("utf-8", errors="ignore")
        except Exception as e:
            logger.warning(f"Fetch failed for {url}: {e}")
            return None

    async def get_company_data(self, ticker: str) -> Optional[Dict[str, Any]]:
        clean_ticker = ticker.upper().replace(".NS", "").replace(".BO", "").strip()
        url = f"https://www.screener.in/company/{clean_ticker}/consolidated/"
        
        try:
            html = await asyncio.to_thread(self._sync_fetch_url, url)
            if not html:
                url_standalone = f"https://www.screener.in/company/{clean_ticker}/"
                html = await asyncio.to_thread(self._sync_fetch_url, url_standalone)
            
            if not html:
                return None

            return self._parse_screener_html(clean_ticker, html)
        except Exception as e:
            logger.error(f"Failed to fetch Screener data for {clean_ticker}: {e}")
            return None

    def _parse_table(self, section_html: str) -> Dict[str, Any]:
        """Extracts structured 10-year tabular data from an HTML table."""
        tbl_match = re.search(r'<table[^>]*>([\s\S]*?)</table>', section_html)
        if not tbl_match:
            return {}

        tbl_content = tbl_match.group(1)
        # Headers (Years)
        headers = [re.sub(r'<[^>]+>', '', th).strip() for th in re.findall(r'<th[^>]*>([\s\S]*?)</th>', tbl_content)]
        headers = [h for h in headers if h and h not in ("+", "-")]

        rows_data = {}
        for tr in re.findall(r'<tr[^>]*>([\s\S]*?)</tr>', tbl_content):
            tds = re.findall(r'<td[^>]*>([\s\S]*?)</td>', tr)
            if not tds:
                continue
            row_name = re.sub(r'<[^>]+>', '', tds[0]).strip().replace("+", "").replace("-", "").strip()
            if not row_name:
                continue
            
            values = []
            for td in tds[1:]:
                clean_v = re.sub(r'<[^>]+>', '', td).strip().replace(",", "").replace("%", "")
                try:
                    values.append(float(clean_v))
                except ValueError:
                    values.append(clean_v)
            if values:
                rows_data[row_name] = values

        return {"years": headers, "rows": rows_data}

    def _parse_screener_html(self, ticker: str, html: str) -> Dict[str, Any]:
        # 1. Company Name
        name_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        name = name_match.group(1).strip() if name_match else ticker

        # 2. Key Top Ratios
        ratios = {}
        items = re.findall(r'<span class="name">\s*([^<]+?)\s*</span>[\s\S]*?<span class="number">\s*([^<]+?)\s*</span>', html)
        for r_name, r_val in items:
            clean_name = r_name.strip()
            clean_val = r_val.strip().replace(',', '')
            try:
                ratios[clean_name] = float(clean_val)
            except ValueError:
                ratios[clean_name] = clean_val

        # 3. About
        about_text = ""
        about_match = re.search(r'<div class="company-profile[^"]*"[^>]*>([\s\S]*?)</div>', html)
        if about_match:
            about_text = re.sub(r'<[^>]+>', ' ', about_match.group(1)).strip()
            about_text = re.sub(r'\s+', ' ', about_text)

        # 4. Pros & Cons
        pros = []
        cons = []
        if 'id="pros"' in html:
            pros_block = html.split('id="pros"')[1].split('</div>')[0]
            pros = [re.sub(r'<[^>]+>', '', p).strip() for p in re.findall(r'<li[^>]*>([\s\S]*?)</li>', pros_block)]
        if 'id="cons"' in html:
            cons_block = html.split('id="cons"')[1].split('</div>')[0]
            cons = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<li[^>]*>([\s\S]*?)</li>', cons_block)]

        # 5. Extract 10-Year Statements
        pl_data = {}
        bs_data = {}
        cf_data = {}
        sh_data = {}

        if 'id="profit-loss"' in html:
            pl_section = html.split('id="profit-loss"')[1].split('</section>')[0]
            pl_data = self._parse_table(pl_section)

        if 'id="balance-sheet"' in html:
            bs_section = html.split('id="balance-sheet"')[1].split('</section>')[0]
            bs_data = self._parse_table(bs_section)

        if 'id="cash-flow"' in html:
            cf_section = html.split('id="cash-flow"')[1].split('</section>')[0]
            cf_data = self._parse_table(cf_section)

        if 'id="shareholding"' in html:
            sh_section = html.split('id="shareholding"')[1].split('</section>')[0]
            sh_data = self._parse_table(sh_section)

        # 6. Compound Growth Ratios
        compound_growth = {}
        cagr_tables = re.findall(r'<table class="ranges-table">([\s\S]*?)</table>', html)
        for tbl in cagr_tables:
            header_match = re.search(r'<th[^>]*>([^<]+)</th>', tbl)
            if header_match:
                section_title = header_match.group(1).strip()
                rows = re.findall(r'<tr>\s*<td>([^<]+)</td>\s*<td>([^<]+)</td>\s*</tr>', tbl)
                compound_growth[section_title] = {r[0].strip(): r[1].strip() for r in rows}

        return {
            "ticker": ticker,
            "name": name,
            "market_cap_cr": ratios.get("Market Cap", 0),
            "current_price": ratios.get("Current Price", 0),
            "high_low": str(ratios.get("High / Low", "")),
            "stock_pe": ratios.get("Stock P/E", 0),
            "book_value": ratios.get("Book Value", 0),
            "dividend_yield": ratios.get("Dividend Yield", 0),
            "roce_pct": ratios.get("ROCE", 0),
            "roe_pct": ratios.get("ROE", 0),
            "face_value": ratios.get("Face Value", 0),
            "ratios": ratios,
            "about": about_text,
            "pros": pros,
            "cons": cons,
            "profit_loss_statement": pl_data,
            "balance_sheet": bs_data,
            "cash_flow_statement": cf_data,
            "shareholding_pattern": sh_data,
            "compound_growth": compound_growth,
            "retrieved_at": datetime.utcnow().isoformat(),
            "source": "SCREENER_IN_LIVE"
        }
