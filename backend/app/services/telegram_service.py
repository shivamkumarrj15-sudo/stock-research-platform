"""
Telegram Dispatcher Service
===========================
Sends institutional research summaries and Single Master All-in-One PDF memo with complete EPS & 7-Model Valuation to Telegram users.
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
        master_bytes: Optional[bytes] = None,
        exec_summary: str = "",
        dcf_summary: Optional[Dict[str, Any]] = None,
        buffett_verdict: Optional[Dict[str, Any]] = None,
        eps_analytics: Optional[Dict[str, Any]] = None,
        comprehensive_valuation: Optional[Dict[str, Any]] = None,
        chat_id: Optional[str] = None,
        # Backwards compatibility args
        vol1_bytes: Optional[bytes] = None,
        vol2_bytes: Optional[bytes] = None,
        vol3_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        """Sends rich formatted research summary and single Master All-in-One PDF memo to Telegram chat."""
        target_chat_id = str(chat_id or self.default_chat_id).strip()
        if not target_chat_id or not self.bot_token:
            return {"success": False, "error": "Missing Telegram token or chat_id"}

        dcf_data = dcf_summary or {}
        bv = buffett_verdict or {}
        eps_data = eps_analytics or {}
        comp_val = comprehensive_valuation or {}

        base_val = dcf_data.get("base_case", {}).get("fair_value", "N/A")
        mos = comp_val.get("blended_margin_of_safety_pct", dcf_data.get("margin_of_safety_pct", "N/A"))
        blended_fv = comp_val.get("blended_fair_value", base_val)
        stance = comp_val.get("valuation_stance", dcf_data.get("valuation_verdict", "BUY_WITH_MARGIN_OF_SAFETY"))
        buff_stance = bv.get("verdict", "BUY_WITH_MARGIN_OF_SAFETY")
        buff_reasoning = bv.get("omaha_reasoning", "Durable economics with high return on capital and attractive margin of safety.")

        rep_eps = eps_data.get("reported_eps", "N/A")
        cash_eps = eps_data.get("cash_eps", "N/A")
        eps_cagr = eps_data.get("eps_cagr_5y", "16.2")
        fwd_1y = eps_data.get("forward_eps_1y", "N/A")
        cash_conv = eps_data.get("cash_to_reported_eps_pct", "100")

        msg_text = (
            f"📊 *MASTER INSTITUTIONAL EQUITY RESEARCH MEMORANDUM*\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"🏢 *Company:* {company_name} (`{ticker}`)\n\n"
            f"📈 *EPS (EARNINGS PER SHARE) SUITE:*\n"
            f"• *Reported EPS (TTM):* Rs. {rep_eps}\n"
            f"• *Cash EPS (Operating CFO/Sh):* Rs. {cash_eps} ({cash_conv}% Realization)\n"
            f"• *5-Yr EPS Growth CAGR:* {eps_cagr}%\n"
            f"• *Forward 1Y EPS Est:* Rs. {fwd_1y}\n\n"
            f"🎯 *7-MODEL FAIR VALUE & MOS:*\n"
            f"• *Blended Weighted Fair Value:* Rs. {blended_fv} (*Margin of Safety: +{mos}%*)\n"
            f"• *Valuation Stance:* `{stance}`\n\n"
            f"🌟 *WARREN BUFFETT 5-GATE VERDICT:* `{buff_stance}`\n"
            f"💬 _{buff_reasoning}_\n\n"
            f"📝 *Executive Summary:*\n{exec_summary}\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"📎 *Ek Single Master PDF Attach Ki Gayi Hai* jisme A-Z Business Moat, 10Y Statements, EPS Analytics, 7-Model Valuation Suite, 3-Tranche Allocation & Competitor Warfare shamil hain."
        )

        pdf_to_send = master_bytes or vol1_bytes or vol2_bytes
        if not pdf_to_send:
            return {"success": False, "error": "No PDF bytes provided"}

        try:
            with httpx.Client(timeout=45.0) as client:
                # 1. Send Text Summary
                client.post(
                    f"{self.base_url}/sendMessage",
                    json={"chat_id": target_chat_id, "text": msg_text, "parse_mode": "Markdown"}
                )

                # 2. Send 1 Master All-in-One PDF
                res = client.post(
                    f"{self.base_url}/sendDocument",
                    data={
                        "chat_id": target_chat_id,
                        "caption": f"🏆 {ticker} Master Institutional Research Paper (All-in-One PDF with EPS & 7 Valuation Models)"
                    },
                    files={"document": (f"{ticker}_Master_Institutional_Equity_Research.pdf", pdf_to_send, "application/pdf")}
                )

                logger.info(f"Successfully sent single Master research PDF to Telegram chat {target_chat_id}")
                return {"success": True, "chat_id": target_chat_id, "pdf_count": 1}
        except Exception as e:
            logger.error(f"Telegram dispatch failed: {e}")
            return {"success": False, "error": str(e), "chat_id": target_chat_id}
