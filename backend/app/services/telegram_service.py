"""
Telegram Dispatcher Service
===========================
Sends institutional research summaries and PDF memos (Volume 1 & Volume 2) to Telegram users.
"""

import httpx
import os
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


class TelegramService:
    def __init__(self, bot_token: str = "", default_chat_id: str = ""):
        self.bot_token = bot_token or os.environ.get("TELEGRAM_BOT_TOKEN", "8663285138:AAFziI1GFNMZMDkl-URuisRbMJbKHBYL0iE")
        self.default_chat_id = default_chat_id or os.environ.get("TELEGRAM_CHAT_ID", "7863710238")
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"

    def send_research_to_telegram(
        self,
        ticker: str,
        company_name: str,
        vol1_bytes: bytes,
        vol2_bytes: bytes,
        exec_summary: str,
        dcf_summary: Dict[str, Any],
        buffett_verdict: Dict[str, Any],
        chat_id: Optional[str] = None,
        vol3_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        """Sends rich formatted research summary and all 3 PDF memos (Business, Financials, Competitor Warfare) to Telegram chat."""
        target_chat_id = str(chat_id or self.default_chat_id).strip()
        if not target_chat_id or not self.bot_token:
            return {"success": False, "error": "Missing Telegram token or chat_id"}

        base_val = dcf_summary.get("base_case", {}).get("fair_value", "N/A")
        mos = dcf_summary.get("margin_of_safety_pct", "N/A")
        verdict = dcf_summary.get("valuation_verdict", "ANALYZE")
        buff_stance = buffett_verdict.get("verdict", "BUY_WITH_MARGIN_OF_SAFETY")
        buff_reasoning = buffett_verdict.get("omaha_reasoning", "Durable economics with high return on capital.")

        msg_text = (
            f"📊 *INSTITUTIONAL 12-PILLAR EQUITY RESEARCH MEMO*\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"🏢 *Company:* {company_name} (`{ticker}`)\n"
            f"💵 *DCF Base Fair Value:* Rs. {base_val} (MOS: *{mos}%*)\n"
            f"⚖️ *Valuation Stance:* `{verdict}`\n\n"
            f"🌟 *WARREN BUFFETT VERDICT:* `{buff_stance}`\n"
            f"💬 _{buff_reasoning}_\n\n"
            f"📝 *Executive Summary:*\n{exec_summary}\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"📎 _Neeche Volume 1 (Business & Moat), Volume 2 (Financials & DCF), aur Volume 3 (Competitor Warfare & Beat Strategy) PDF reports attach kar di gayi hain._"
        )

        try:
            with httpx.Client(timeout=35.0) as client:
                # 1. Send Text Summary
                client.post(
                    f"{self.base_url}/sendMessage",
                    json={"chat_id": target_chat_id, "text": msg_text, "parse_mode": "Markdown"}
                )

                # 2. Send Volume 1 PDF
                client.post(
                    f"{self.base_url}/sendDocument",
                    data={"chat_id": target_chat_id, "caption": f"📄 Volume 1: {ticker} Business Model & 9-Pillar Moat"},
                    files={"document": (f"{ticker}_Vol1_Business_Model_and_Moat.pdf", vol1_bytes, "application/pdf")}
                )

                # 3. Send Volume 2 PDF
                client.post(
                    f"{self.base_url}/sendDocument",
                    data={"chat_id": target_chat_id, "caption": f"📑 Volume 2: {ticker} Financials, 3-Scenario DCF & Buffett Verdict"},
                    files={"document": (f"{ticker}_Vol2_Financials_and_Buffett_Verdict.pdf", vol2_bytes, "application/pdf")}
                )

                # 4. Send Volume 3 PDF (Competitor Warfare)
                if vol3_bytes:
                    client.post(
                        f"{self.base_url}/sendDocument",
                        data={"chat_id": target_chat_id, "caption": f"⚔️ Volume 3: {ticker} Competitor Warfare, Peer Growth & Market Domination Strategy"},
                        files={"document": (f"{ticker}_Vol3_Competitor_Warfare_and_Beat_Analysis.pdf", vol3_bytes, "application/pdf")}
                    )

                logger.info(f"Successfully sent research pack (3 PDFs) to Telegram chat {target_chat_id}")
                return {"success": True, "chat_id": target_chat_id, "pdf_count": 3 if vol3_bytes else 2}
        except Exception as e:
            logger.error(f"Telegram dispatch failed: {e}")
            return {"success": False, "error": str(e), "chat_id": target_chat_id}

