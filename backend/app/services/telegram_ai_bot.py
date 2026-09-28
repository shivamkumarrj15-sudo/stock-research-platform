"""
Interactive Telegram Stock Research & Deep AI Assistant Bot
===========================================================
Features:
1. Full 20-Stage Institutional Research with 2-Volume PDFs (`/research <TICKER>`)
2. Warren Buffett 5-Gate Checklist & Verdict (`/buffett <TICKER>`)
3. Context-Aware AI Chat: Remembers researched companies and answers any deep questions
   about business models, value chains, raw materials, pricing power, moats, DCF, risks, and forensics.
4. Auto-detects company mentions and provides instant investment analysis.
"""

import asyncio
import httpx
import os
import sys
import logging
import json
from typing import Dict, Any, Optional, List

# Path configuration
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.services.institutional_pipeline import InstitutionalPipeline
from app.services.telegram_service import TelegramService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TelegramAIBot")


class UserSession:
    def __init__(self, chat_id: int):
        self.chat_id = chat_id
        self.last_stock: Optional[str] = None
        self.last_company_name: Optional[str] = None
        self.last_research_data: Optional[Dict[str, Any]] = None
        self.history: List[Dict[str, str]] = []

    def add_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})
        if len(self.history) > 12:
            self.history = self.history[-12:]

    def get_context_summary(self) -> str:
        if not self.last_research_data:
            return "No stock researched yet."
        
        fund = self.last_research_data.get("fundamentals", {})
        ai = self.last_research_data.get("ai_research", {})
        forensics = self.last_research_data.get("forensics", {})
        bv = self.last_research_data.get("buffett_verdict", {})
        dcf = forensics.get("dcf", {})

        return f"""
CURRENT ACTIVE STOCK IN CONVERSATION:
- Symbol: {self.last_stock} ({self.last_company_name})
- Current Price: Rs. {fund.get('current_price')}
- Market Cap: Rs. {fund.get('market_cap_cr')} Cr | P/E: {fund.get('pe_ratio')} | P/B: {fund.get('pb_ratio')}
- ROE: {fund.get('roe_pct')}% | ROCE: {fund.get('roce_pct')}% | Debt/Equity: {fund.get('debt_to_equity')}
- Piotroski Score: {forensics.get('piotroski', {}).get('score')}/9 ({forensics.get('piotroski', {}).get('category')})
- DCF Base Fair Value: Rs. {dcf.get('base_case', {}).get('fair_value')} (Margin of Safety: {dcf.get('margin_of_safety_pct')}%)
- Warren Buffett Verdict: {bv.get('verdict')} - {bv.get('omaha_reasoning')}
- Business Model Breakdown: {ai.get('business_model_ultra_detailed', {}).get('simple_analogy') or ai.get('business_model_explained_simply')}
- Raw Materials & Supply: {json.dumps(ai.get('business_model_ultra_detailed', {}).get('raw_materials_and_suppliers', {}))}
- Moat & Pricing Power: {json.dumps(ai.get('economic_moat_evaluation', {}))}
- Competitor Warfare & Peer Benchmarking: {json.dumps(ai.get('competitor_warfare_and_beat_analysis', {}))}
- Catalysts & Contracts: {json.dumps(ai.get('verified_contracts_and_catalysts', []))}
- Key Risks & Red Flags: {json.dumps(ai.get('forensic_red_flags', []))}
"""


from app.core.config import settings

class StockIQTelegramBot:
    def __init__(self, bot_token: str = "", openrouter_key: str = ""):
        self.bot_token = (bot_token or os.environ.get("TELEGRAM_BOT_TOKEN") or getattr(settings, "TELEGRAM_BOT_TOKEN", "")).strip()
        self.openrouter_key = (openrouter_key or os.environ.get("AI_API_KEY") or getattr(settings, "AI_API_KEY", "")).strip()
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        self.pipeline = InstitutionalPipeline()
        self.telegram_service = TelegramService(self.bot_token)
        self.last_update_id = 0
        self.sessions: Dict[int, UserSession] = {}
        self.is_running = False

    def get_session(self, chat_id: int) -> UserSession:
        if chat_id not in self.sessions:
            self.sessions[chat_id] = UserSession(chat_id)
        return self.sessions[chat_id]


    async def start_polling(self):
        """Starts real-time continuous polling loop for incoming Telegram messages."""
        if self.is_running:
            return
        self.is_running = True
        logger.info(f"Starting StockIQ Telegram AI Bot on token {self.bot_token[:10]}...")
        print(f"\n[*] Telegram Bot is ACTIVE & POLLING (Bot: @shivam_ai_news_bot)!", flush=True)

        async with httpx.AsyncClient(timeout=35.0) as client:
            while self.is_running:
                try:
                    res = await client.get(
                        f"{self.base_url}/getUpdates",
                        params={"offset": self.last_update_id + 1, "timeout": 20}
                    )
                    if res.status_code == 200:
                        data = res.json()
                        updates = data.get("result", [])
                        for update in updates:
                            self.last_update_id = update["update_id"]
                            if "message" in update and "text" in update["message"]:
                                asyncio.create_task(self.handle_message(update["message"]))
                except Exception as e:
                    logger.error(f"Telegram polling loop error: {e}")
                    await asyncio.sleep(2)

    async def handle_message(self, message: Dict[str, Any]):
        chat_id = message["chat"]["id"]
        text = message.get("text", "").strip()
        user_name = message.get("from", {}).get("first_name", "Investor")

        if not text:
            return

        session = self.get_session(chat_id)
        logger.info(f"Received message from {user_name} ({chat_id}): {text}")

        # Command 1: /start or /help
        if text.lower() in ("/start", "/help"):
            welcome_msg = (
                f"👋 *Namaste {user_name}! Main aapka StockIQ AI Financial & Research Copilot hoon.*\n\n"
                f"Main aapke liye Warren Buffett & Charlie Munger ke institutional framework par kisi bhi company ka A-Z analysis karta hoon aur aapke sabhi doubts solve karta hoon.\n\n"
                f"📌 *Main kya kar sakta hoon:*\n"
                f"1️⃣ `/research <STOCK>` — 2-Volume PDF Memos (Business Model + Forensics & Valuation) generate karke Telegram par bhejunga.\n"
                f"   _Example:_ `/research WEBELSOLAR` ya `/research TATAMOTORS`\n\n"
                f"2️⃣ `/buffett <STOCK>` — Warren Buffett 5-Gate Buy/Reject Checklist check karega.\n"
                f"   _Example:_ `/buffett TCS`\n\n"
                f"3️⃣ 💬 *Interactive AI Q&A:* Researched stock ke bare mein koi bhi sawal poochein:\n"
                f"   • _Is company ka raw material kahan se aata hai?_\n"
                f"   • _Iska business model simple language mein samjhao._\n"
                f"   • _Kya ispe debt zyada hai?_\n"
                f"   • _Warren Buffett isko kyu buy ya reject karega?_\n"
                f"   • _Competitors kaun hain aur moat kaisa hai?_"
            )
            await self.send_text(chat_id, welcome_msg)
            return

        # Command 2: /research <TICKER>
        if text.lower().startswith("/research"):
            parts = text.split(maxsplit=1)
            if len(parts) < 2:
                await self.send_text(chat_id, "⚠️ *Format:* `/research <TICKER>` (e.g. `/research WEBELSOLAR` ya `/research TATAMOTORS`)")
                return

            raw_ticker = parts[1].strip().upper()
            ticker = raw_ticker

            await self.send_text(
                chat_id,
                f"🔍 *{ticker}* ka 20-Stage Buffett & Forensic Research shuru ho raha hai...\n"
                f"📊 _10-Yr statements, DuPont analysis, 3-scenario DCF aur 2-Volume PDFs generate ho rahe hain (15-20 seconds)..._"
            )
            
            try:
                result = await self.pipeline.run_full_research(ticker=ticker)
                session.last_stock = result.get("ticker", ticker)
                session.last_company_name = result.get("company_name", ticker)
                session.last_research_data = result

                v1_bytes = None
                v2_bytes = None
                v3_bytes = None
                if os.path.exists(result.get("pdf_volume1_path", "")):
                    with open(result["pdf_volume1_path"], "rb") as f1:
                        v1_bytes = f1.read()
                if os.path.exists(result.get("pdf_volume2_path", "")):
                    with open(result["pdf_volume2_path"], "rb") as f2:
                        v2_bytes = f2.read()
                if os.path.exists(result.get("pdf_volume3_path", "")):
                    with open(result["pdf_volume3_path"], "rb") as f3:
                        v3_bytes = f3.read()

                if v1_bytes and v2_bytes:
                    self.telegram_service.send_research_to_telegram(
                        ticker=ticker,
                        company_name=result.get("company_name", ticker),
                        vol1_bytes=v1_bytes,
                        vol2_bytes=v2_bytes,
                        vol3_bytes=v3_bytes,
                        exec_summary=result.get("ai_research", {}).get("executive_summary", ""),
                        dcf_summary=result.get("forensics", {}).get("dcf", {}),
                        buffett_verdict=result.get("buffett_verdict", {}),
                        chat_id=str(chat_id)
                    )
                else:
                    await self.send_text(chat_id, f"✅ Research complete for *{session.last_company_name}*!")
                
                # Follow up prompt
                await self.send_text(
                    chat_id,
                    f"💡 *Aap {session.last_company_name} ke bare mein koi bhi question pooch sakte hain!*\n"
                    f"_Jaise: 'Competitors ko kaise beat kar raha hai?', 'Kya aage nikal payega?', 'Raw material kahan se aata hai?'_"
                )
            except Exception as e:
                logger.error(f"Research error: {e}", exc_info=True)
                await self.send_text(chat_id, f"❌ Research fail ho gaya: {str(e)}")
            return

        # Command 3: /buffett <TICKER>
        if text.lower().startswith("/buffett"):
            parts = text.split(maxsplit=1)
            if len(parts) < 2:
                await self.send_text(chat_id, "⚠️ *Format:* `/buffett <TICKER>` (e.g. `/buffett TCS`)")
                return
            ticker = parts[1].strip().upper()

            await self.send_text(chat_id, f"⏳ *{ticker}* ka Warren Buffett 5-Gate evaluation check ho raha hai...")
            try:
                result = await self.pipeline.run_full_research(ticker=ticker)
                session.last_stock = result.get("ticker", ticker)
                session.last_company_name = result.get("company_name", ticker)
                session.last_research_data = result

                bv = result.get("buffett_verdict", {})
                dcf = result.get("forensics", {}).get("dcf", {})
                fund = result.get("fundamentals", {})
                
                msg = (
                    f"🌟 *WARREN BUFFETT EVALUATION: {result.get('company_name')} ({ticker})*\n"
                    f"━━━━━━━━━━━━━━━━━━━━━\n"
                    f"🏆 *FINAL DECISION:* `{bv.get('verdict', 'BUY_WITH_MARGIN_OF_SAFETY')}`\n\n"
                    f"📊 *Key Financials:*\n"
                    f"• *CMP:* Rs. {fund.get('current_price')} | *P/E:* {fund.get('pe_ratio')}\n"
                    f"• *ROE / ROCE:* {fund.get('roe_pct')}% / {fund.get('roce_pct')}%\n"
                    f"• *DCF Fair Value:* Rs. {dcf.get('base_case', {}).get('fair_value')} (Margin of Safety: *{dcf.get('margin_of_safety_pct')}%*)\n\n"
                    f"💬 *Omaha Rationale:*\n_{bv.get('omaha_reasoning')}_\n"
                )
                await self.send_text(chat_id, msg)
            except Exception as e:
                await self.send_text(chat_id, f"❌ Error: {str(e)}")
            return

        # Default: Context-Aware Deep AI Q&A
        await self.handle_ai_qa(session, text)

    async def handle_ai_qa(self, session: UserSession, question: str):
        """Answers any investment/financial questions using OpenRouter AI with active research context."""
        context_block = session.get_context_summary()
        session.add_message("user", question)

        system_prompt = (
            "You are StockIQ AI, an elite institutional equity research analyst and senior partner at Berkshire Hathaway "
            "advising an investor. You have access to deep financial forensics, 10-year statements, supply chain data, "
            "DuPont analysis, DCF valuations, and competitive moats.\n\n"
            "GUIDELINES:\n"
            "1. Answer the user's question clearly, thoroughly, and with deep financial accuracy.\n"
            "2. Respond in friendly, professional Hinglish (Hindi + English) or English depending on how user asked.\n"
            "3. If the question relates to the currently active researched stock, use the rich facts and numbers from CONTEXT.\n"
            "4. Explain complex business models, raw materials, supplier dependencies, unit economics, and moats in simple real-world analogies.\n"
            "5. If the user asks about a different stock not yet researched, provide a high-level Buffett-style overview and suggest running `/research <STOCK>`."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": f"ACTIVE RESEARCH CONTEXT:\n{context_block}"}
        ]
        
        # Add conversation history
        for msg in session.history[-6:]:
            messages.append(msg)

        async with httpx.AsyncClient(timeout=35.0) as client:
            headers = {
                "Authorization": f"Bearer {self.openrouter_key}",
                "HTTP-Referer": "https://stockiq.research",
                "X-Title": "StockIQ Telegram AI Assistant",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "openai/gpt-4o-mini",
                "messages": messages,
                "temperature": 0.35,
                "max_tokens": 1200
            }
            try:
                res = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    reply = res.json()["choices"][0]["message"]["content"]
                    session.add_message("assistant", reply)
                    await self.send_text(session.chat_id, f"💡 *StockIQ AI Analysis:*\n\n{reply}")
                else:
                    logger.error(f"OpenRouter error: {res.status_code} {res.text}")
                    await self.send_text(session.chat_id, "⚠️ AI response generate nahi ho paya. Kripya dobara try karein.")
            except Exception as e:
                logger.error(f"AI Q&A error: {e}")
                await self.send_text(session.chat_id, f"⚠️ Error answering question: {str(e)}")

    async def send_text(self, chat_id: int, text: str):
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                # Try Markdown first
                res = await client.post(
                    f"{self.base_url}/sendMessage",
                    json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
                )
                if res.status_code != 200:
                    # Fallback without markdown parsing in case of markdown syntax error
                    await client.post(
                        f"{self.base_url}/sendMessage",
                        json={"chat_id": chat_id, "text": text}
                    )
            except Exception as e:
                logger.error(f"Failed to send Telegram message: {e}")


# Singleton instance
telegram_bot_instance = StockIQTelegramBot()

if __name__ == "__main__":
    asyncio.run(telegram_bot_instance.start_polling())
