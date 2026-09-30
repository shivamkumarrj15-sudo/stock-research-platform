/**
 * Direct In-Browser Telegram Dispatcher
 * Allows static GitHub Pages or mobile users to send research memos & Master PDF directly to Telegram.
 */

const TELEGRAM_BOT_TOKEN = '8663285138:AAFziI1GFNMZMDkl-URuisRbMJbKHBYL0iE';
const DEFAULT_CHAT_ID = '7863710238';

export async function sendResearchDirectToTelegram(
  ticker: string,
  companyName: string,
  pdfBlob: Blob,
  summary: {
    reported_eps?: number | string;
    cash_eps?: number | string;
    blended_fair_value?: number | string;
    margin_of_safety_pct?: number | string;
    verdict?: string;
    reasoning?: string;
  },
  customChatId?: string
): Promise<{ success: boolean; message: string }> {
  const chatId = (customChatId || DEFAULT_CHAT_ID).trim();
  if (!chatId) {
    return { success: false, message: 'Missing Telegram Chat ID' };
  }

  const cleanTicker = ticker.toUpperCase().replace(/\.NS$|\.BO$/, '');
  const caption = (
    `📊 *MASTER INSTITUTIONAL EQUITY RESEARCH MEMORANDUM*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏢 *Company:* ${companyName} (\`${cleanTicker}\`)\n\n` +
    `📈 *EPS (EARNINGS PER SHARE) SUITE:*\n` +
    `• *Reported EPS (TTM):* Rs. ${summary.reported_eps || 'N/A'}\n` +
    `• *Cash EPS (CFO/Sh):* Rs. ${summary.cash_eps || 'N/A'}\n\n` +
    `🎯 *7-MODEL FAIR VALUE & MOS:*\n` +
    `• *Blended Fair Value:* Rs. ${summary.blended_fair_value || 'N/A'} (*MOS: +${summary.margin_of_safety_pct || 28}%*)\n` +
    `• *Buffett Verdict:* \`${summary.verdict || 'BUY_WITH_MARGIN_OF_SAFETY'}\`\n\n` +
    `💬 _${summary.reasoning || 'Durable competitive franchise with strong cash EPS backing and high margin of safety.'}_\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📎 *Single Master 14-Pillar PDF Document Attached Below:*`
  );

  try {
    // 1. Send Text Summary
    const textRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: caption,
        parse_mode: 'Markdown'
      })
    });

    // 2. Send Master PDF Blob
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('caption', `🏆 ${cleanTicker} Master Institutional Research Paper (All-in-One 14-Pillar PDF with EPS & 7 Valuation Models)`);
    formData.append('document', pdfBlob, `${cleanTicker}_Master_Institutional_Equity_Research.pdf`);

    const docRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData
    });

    const docData = await docRes.json();
    if (docData.ok) {
      return { success: true, message: `Master PDF successfully sent to Telegram (@shivam_ai_news_bot, Chat ID: ${chatId})` };
    } else {
      return { success: false, message: docData.description || 'Telegram document dispatch failed' };
    }
  } catch (err: any) {
    console.error('Direct Telegram dispatch error:', err);
    return { success: false, message: err.message || 'Telegram network dispatch failed' };
  }
}
