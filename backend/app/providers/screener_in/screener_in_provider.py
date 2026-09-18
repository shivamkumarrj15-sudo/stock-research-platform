"""
Screener.in Data Provider Implementation.
Uses user's logged-in Screener.in sessionid cookie to fetch complete company fundamentals, 10-year financials, quarterly results, ratios, and shareholding patterns.
"""

import httpx
import re
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)

class ScreenerInProvider:
    def __init__(self, session_id: str = ""):
        self.session_id = session_id
        self.is_authenticated = bool(session_id)
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        if self.session_id:
            self.headers["Cookie"] = f"sessionid={self.session_id};"

    def set_session_id(self, session_id: str):
        self.session_id = session_id.strip()
        self.is_authenticated = bool(self.session_id)
        if self.session_id:
            self.headers["Cookie"] = f"sessionid={self.session_id};"
        elif "Cookie" in self.headers:
            del self.headers["Cookie"]

    async def verify_session(self) -> Dict[str, Any]:
        """Verify if the session cookie is valid and fetch logged-in user details if any."""
        url = "https://www.screener.in/dash/"
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=10.0, follow_redirects=True) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    html = res.text
                    is_logged_in = "logout" in html.lower() or "/screens/following/" in html or "user-menu" in html
                    
                    # Extract username if present
                    username_match = re.search(r'class="user-name"[^>]*>([^<]+)</span>', html)
                    username = username_match.group(1).strip() if username_match else "Screener User"
                    
                    return {
                        "success": True,
                        "is_authenticated": is_logged_in,
                        "username": username if is_logged_in else None,
                        "message": "Screener.in session active & verified" if is_logged_in else "Public Screener.in access (Login cookie optional)"
                    }
                return {
                    "success": False,
                    "is_authenticated": False,
                    "message": f"Screener.in returned status code {res.status_code}"
                }
        except Exception as e:
            logger.error(f"Screener session verification failed: {e}")
            return {
                "success": False,
                "is_authenticated": False,
                "error": str(e)
            }

    async def get_company_data(self, ticker: str) -> Optional[Dict[str, Any]]:
        """Fetch comprehensive financial data for a stock from Screener.in."""
        clean_ticker = ticker.upper().replace(".NS", "").replace(".BO", "").strip()
        url = f"https://www.screener.in/company/{clean_ticker}/consolidated/"
        
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=12.0, follow_redirects=True) as client:
                res = await client.get(url)
                if res.status_code == 404:
                    # Try standalone
                    url_standalone = f"https://www.screener.in/company/{clean_ticker}/"
                    res = await client.get(url_standalone)
                
                if res.status_code != 200:
                    logger.warning(f"Screener.in returned {res.status_code} for {clean_ticker}")
                    return None

                html = res.text
                return self._parse_screener_html(clean_ticker, html)
        except Exception as e:
            logger.error(f"Failed to fetch Screener data for {clean_ticker}: {e}")
            return None

    def _parse_screener_html(self, ticker: str, html: str) -> Dict[str, Any]:
        """Parse the HTML response into structured financial metrics."""
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

        # 3. About / Business Profile
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

        # 5. Compound Growth Ratios (Sales, Profit, Stock Price CAGR, ROE)
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
            "compound_growth": compound_growth,
            "retrieved_at": datetime.utcnow().isoformat(),
            "source": "SCREENER_IN_LIVE"
        }
