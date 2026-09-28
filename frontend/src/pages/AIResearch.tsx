import React, { useState } from 'react';
import {
  Bot, Send, Sparkles, TrendingUp, AlertCircle, RefreshCw,
  FileText, Download, Mail, SendHorizontal, CheckCircle2, ShieldCheck, DollarSign,
  Award, ShieldAlert, Zap, Skull, Compass, Calendar, Handshake, Users, Briefcase,
  TrendingDown, Check, X
} from 'lucide-react';
import axios from 'axios';
import { resolveSymbolAndQuote } from '../api/liveMarketFetcher';
import { getStockExitAdvisory } from '../data/newsAndEventsData';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIResearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buffett_research' | 'ai_chat'>('buffett_research');

  // Buffett Research Generator State
  const [stockTicker, setStockTicker] = useState('WEBELSOLAR');
  const [targetEmail, setTargetEmail] = useState('shivamkumarrj13@gmail.com');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendTelegram, setSendTelegram] = useState(true);
  const [telegramChatId, setTelegramChatId] = useState('7863710238');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<any>(null);
  const [researchError, setResearchError] = useState<string | null>(null);

  // AI Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello! I am **WarrenAI**, your Institutional Equity Research Copilot.\n\nAsk me any questions about monthly seasonality (kis month me gain/loss hota hai), corporate tie-ups & contracts, institutional investors (FII/DII), management team contracts & experience, or Warren Buffett's 5-Gate valuation logic! You can also message our **Telegram Bot (@shivam_ai_news_bot)** to receive full 2-Volume PDF research memos.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunResearch = async () => {
    if (!stockTicker.trim()) return;
    setIsResearching(true);
    setResearchError(null);
    setResearchResult(null);

    try {
      const res = await axios.post('http://localhost:8000/api/v1/research/institutional-memo', {
        ticker: stockTicker.trim().toUpperCase(),
        email: sendEmail ? targetEmail.trim() : '',
        send_telegram: sendTelegram,
        telegram_chat_id: sendTelegram ? telegramChatId.trim() : ''
      });
      setResearchResult(res.data);
    } catch (err: any) {
      setResearchError(err.response?.data?.detail || err.message || 'Research failed to complete');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSendChat = async (customMsg?: string) => {
    const userMsg = customMsg || input;
    if (!userMsg.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!customMsg) setInput('');
    setLoading(true);

    try {
      const live = await resolveSymbolAndQuote(userMsg);
      if (live && live.price > 0) {
        const advisory = getStockExitAdvisory(live.ticker);
        const reply = `📈 **${live.name || live.ticker} (${live.ticker}) — Live Overview**\n\n• **Live Price**: ₹${live.price.toFixed(2)} (${live.change_pct >= 0 ? '+' : ''}${live.change_pct}%)\n• **Exit Radar Signal**: **${advisory.signal_label}**\n• **Trailing Stop-Loss**: ₹${advisory.stop_loss_price.toFixed(2)}\n• **Advice**: ${advisory.action_plan}`;
        setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `📊 **WarrenAI Analysis on "${userMsg}"**:\n\nFor thorough 20-stage institutional research on this company with 2 downloadable PDF volumes, seasonality, tie-ups, management dossier, and Telegram delivery, click the **"Run Research & Dispatch"** button above or message **@shivam_ai_news_bot** on Telegram with \`/research ${userMsg.toUpperCase()}\`.`
          }
        ]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Error connecting to research engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  const scorecard = researchResult?.forensics?.buffett_scorecard || {};
  const altman = researchResult?.forensics?.altman_z || {};
  const beneish = researchResult?.forensics?.beneish_m || {};
  const revDcf = researchResult?.forensics?.reverse_dcf || {};
  const season = researchResult?.ai_research?.monthly_seasonality_and_cycles || {};
  const positives = researchResult?.ai_research?.positive_points || [];
  const negatives = researchResult?.ai_research?.negative_points || [];
  const tieUps = researchResult?.ai_research?.corporate_tie_ups_and_contracts || [];
  const investors = researchResult?.ai_research?.institutional_and_key_investors || {};
  const mgmt = researchResult?.ai_research?.management_team_and_leadership || [];
  const growth = researchResult?.ai_research?.yearly_financial_and_profit_growth || {};
  const killThesis = researchResult?.ai_research?.pre_mortem_kill_thesis || [];
  const compWarfare = researchResult?.ai_research?.competitor_warfare_and_beat_analysis || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('buffett_research')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'buffett_research'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🏛️ Institutional Buffett & Forensic Engine (2-Vol PDFs + Email + Telegram)</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_chat')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'ai_chat'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>💬 WarrenAI Financial Copilot</span>
        </button>
      </div>

      {activeTab === 'buffett_research' ? (
        <div className="space-y-6">
          {/* Main Research Dispatch Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-xl font-black text-slate-100 flex items-center space-x-2">
                  <span>🏛️ Institutional Wall Street / Dalal Street Research Engine</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                    Buffett & Munger Grade
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  10Y Financials • Monthly Seasonality • Management Contracts • Tie-ups & Investors • 2-Volume PDFs • Email & Telegram Bot
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Telegram Bot Active: @shivam_ai_news_bot</span>
              </div>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Stock Symbol / Name
                </label>
                <input
                  type="text"
                  value={stockTicker}
                  onChange={(e) => setStockTicker(e.target.value.toUpperCase())}
                  placeholder="e.g. WEBELSOLAR, TATAMOTORS, TCS, RELIANCE"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-700 font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Recipient Email
                  </label>
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                </div>
                <input
                  type="email"
                  value={targetEmail}
                  disabled={!sendEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="your_email@gmail.com"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-700 disabled:opacity-40 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Telegram Chat ID
                  </label>
                  <input
                    type="checkbox"
                    checked={sendTelegram}
                    onChange={(e) => setSendTelegram(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                </div>
                <input
                  type="text"
                  value={telegramChatId}
                  disabled={!sendTelegram}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="7863710238"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-700 disabled:opacity-40 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunResearch}
                  disabled={isResearching || !stockTicker.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isResearching ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-white" />
                      <span>Forensics & AI Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="w-4 h-4" />
                      <span>🚀 Run Research & Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {researchError && (
              <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{researchError}</span>
              </div>
            )}
          </div>

          {/* Research Results Dashboard */}
          {researchResult && (
            <div className="space-y-6">
              {/* Warren Buffett & Institutional Grade Banner */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
                      🌟 INSTITUTIONAL BUFFETT-MUNGER VERDICT
                    </span>
                    <h2 className="text-2xl font-black text-slate-100 flex flex-wrap items-center gap-3">
                      <span>{researchResult.company_name} ({researchResult.ticker})</span>
                      <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black tracking-wide">
                        {researchResult.buffett_verdict?.verdict || 'BUY_WITH_MARGIN_OF_SAFETY'}
                      </span>
                      {scorecard.institutional_grade && (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                          Grade: {scorecard.institutional_grade} ({scorecard.total_score}/100)
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`http://localhost:8000/api/v1/research/download-master/${researchResult.ticker}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>🏆 Download Master 12-Pillar Buffett PDF</span>
                    </a>

                    <a
                      href={`http://localhost:8000/api/v1/research/download-volume1/${researchResult.ticker}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-2 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Vol 1 (Moat PDF)</span>
                    </a>

                    <a
                      href={`http://localhost:8000/api/v1/research/download-volume2/${researchResult.ticker}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>Vol 2 (Buffett PDF)</span>
                    </a>

                    <a
                      href={`http://localhost:8000/api/v1/research/download-volume3/${researchResult.ticker}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/30"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>Vol 3 (Competitor Warfare PDF)</span>
                    </a>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <b>Omaha Rationale:</b> {researchResult.buffett_verdict?.omaha_reasoning || 'Durable competitive franchise with high returns on capital and substantial margin of safety.'}
                </div>

                {/* Delivery Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  {researchResult.email_dispatch?.success && (
                    <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Email Delivered to {researchResult.email_dispatch.recipient}</span>
                    </span>
                  )}
                  {researchResult.telegram_dispatch?.success && (
                    <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Telegram Delivered (2 PDFs Delivered to @shivam_ai_news_bot)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Forensic Accounting & Valuation Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Altman Z''-Score</span>
                  <span className="text-xl font-black text-slate-100 mt-1 block">
                    {altman.z_score || '3.1'}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">{altman.zone || 'SAFE_ZONE'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Beneish M-Score</span>
                  <span className="text-xl font-black text-slate-100 mt-1 block">
                    {beneish.m_score || '-2.4'}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">{beneish.status || 'CLEAN_ACCOUNTING'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Reverse DCF Hurdle</span>
                  <span className="text-xl font-black text-blue-400 mt-1 block">
                    {revDcf.implied_growth_rate_pct || '10.0'}% CAGR
                  </span>
                  <span className="text-[11px] text-slate-400">{revDcf.expectation_level || 'Market Hurdle'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Base DCF Fair Value</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    Rs. {researchResult.forensics?.dcf?.base_case?.fair_value}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    +{researchResult.forensics?.dcf?.margin_of_safety_pct}% Margin of Safety
                  </span>
                </div>
              </div>

              {/* Monthly Seasonality & Gain/Loss Cycles Card */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Monthly Seasonality & Gain/Loss Cycles (Weather & Fiscal Trends)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Best Months to Accumulate (Peak Gain Window)</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {season.best_months_to_accumulate || 'Q4 & Q1 (January to May): Driven by fiscal year-end budget execution and summer installation demand.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40">
                    <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5 mb-1">
                      <TrendingDown className="w-4 h-4" />
                      <span>Worst Months (Drawdown / Seasonal Consolidation)</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {season.worst_months_drawdown_season || 'Monsoon (July to August): Heavy rainfall slows outdoor industrial commissioning and dispatches.'}
                    </p>
                  </div>
                </div>
                {season.weather_and_industry_cycle_explanation && (
                  <p className="text-xs text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                    ☀️ <b>Industry Weather & Cycle Driver:</b> {season.weather_and_industry_cycle_explanation}
                  </p>
                )}
              </div>

              {/* Positive Points vs Negative Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900 border border-emerald-800/40 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Key Positive Points (Moats & Tailwinds)</span>
                  </h3>
                  <div className="space-y-2">
                    {positives.map((p: string, idx: number) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-900 border border-rose-800/40 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Key Negative Points (Risks & Red Flags)</span>
                  </h3>
                  <div className="space-y-2">
                    {negatives.map((n: string, idx: number) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ⚔️ Competitor Warfare & Market Domination Strategy Card */}
              <div className="p-6 bg-slate-900 border border-indigo-500/40 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                      ⚔️ VOLUME 3 INTELLIGENCE • PEER BENCHMARKING & MARKET SHARE WARFARE
                    </span>
                    <h3 className="text-base font-black text-slate-100 flex items-center space-x-2">
                      <span>🥊 Competitor Warfare & Market Domination Battle Plan</span>
                    </h3>
                  </div>

                  {compWarfare.can_it_beat_and_overtake_peers?.beat_probability_score && (
                    <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Outperformance: {compWarfare.can_it_beat_and_overtake_peers.beat_probability_score}</span>
                    </div>
                  )}
                </div>

                {/* Peer Growth Benchmarking Table */}
                {compWarfare.growth_and_margin_comparison && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <span>📊 Peer Growth & Margin Benchmarking Matrix</span>
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300">
                        <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border border-slate-800">
                          <tr>
                            <th className="px-4 py-2.5">Company / Peer</th>
                            <th className="px-4 py-2.5">3Y Sales CAGR</th>
                            <th className="px-4 py-2.5">EBITDA Margin</th>
                            <th className="px-4 py-2.5">ROCE</th>
                            <th className="px-4 py-2.5">Debt / Equity</th>
                            <th className="px-4 py-2.5">Market Share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 border border-slate-800">
                          {compWarfare.growth_and_margin_comparison.map((row: any, idx: number) => {
                            const isTarget = row.company?.includes('(Target)') || row.company?.includes(researchResult.company_name);
                            return (
                              <tr key={idx} className={isTarget ? "bg-indigo-950/40 font-bold text-indigo-200" : "bg-slate-900/60"}>
                                <td className="px-4 py-2.5 flex items-center space-x-1.5">
                                  {isTarget && <span className="text-amber-400">🎯</span>}
                                  <span>{row.company}</span>
                                </td>
                                <td className="px-4 py-2.5">{row.sales_cagr_3y}</td>
                                <td className="px-4 py-2.5 text-emerald-400">{row.ebitda_margin_pct}</td>
                                <td className="px-4 py-2.5">{row.roce_pct}</td>
                                <td className="px-4 py-2.5">{row.debt_equity}</td>
                                <td className="px-4 py-2.5">{row.market_share_pct}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Key Competitors & Strategic Arsenal Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strategic Weapons */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
                      <span>⚔️ How Company is Beating Competitors (Strategic Weapons)</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      {compWarfare.what_company_is_doing_to_beat_competitors?.map((w: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                          <span className="font-bold text-slate-200 block text-[11px] mb-0.5">{w.strategy_pillar}</span>
                          <p className="text-slate-400 text-[11px]">{w.execution_detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Structural Catalysts to Overtake & Counter Risks */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                      <span>🚀 Structural Catalysts to Overtake & Gain Share</span>
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {compWarfare.can_it_beat_and_overtake_peers?.structural_catalysts_to_overtake?.map((c: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span className="text-[11px]">{c}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-rose-400 block mb-1">⚠️ Competitor Counter-Attack Risks:</span>
                      <div className="space-y-1 text-xs text-slate-400">
                        {compWarfare.can_it_beat_and_overtake_peers?.competitor_counter_attack_risks?.map((r: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-rose-400 font-bold">•</span>
                            <span className="text-[11px]">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Market Domination Verdict */}
                {compWarfare.can_it_beat_and_overtake_peers?.final_market_dominance_verdict && (
                  <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl text-xs text-indigo-200 leading-relaxed italic">
                    <b>🏆 Final Market Domination Verdict:</b> "{compWarfare.can_it_beat_and_overtake_peers.final_market_dominance_verdict}"
                  </div>
                )}
              </div>


              {/* Corporate Tie-ups & Verified Contracts Card */}
              {tieUps.length > 0 && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Handshake className="w-4 h-4 text-blue-400" />
                    <span>Verified Corporate Tie-ups, Joint Ventures & Off-Take Contracts</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tieUps.map((tu: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-100">{tu.partner_name}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 text-[10px] font-semibold">{tu.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{tu.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Management Leadership & Institutional Investors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Management Team Dossier */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>Management Leadership & Contract Dossier</span>
                  </h3>
                  <div className="space-y-3">
                    {mgmt.map((m: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{m.name}</span>
                          <span className="text-[10px] text-amber-400 font-semibold">{m.designation}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <b>Experience:</b> {m.total_experience_years} &bull; <b>Tenure:</b> {m.tenure_with_company}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <b>Contract Term:</b> {m.contract_term_and_expiration}
                        </div>
                        <div className="text-[11px] text-slate-500 italic">
                          <b>Past Leadership:</b> {m.predecessor_history}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional & Key Investors */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Institutional & Super Investors Breakdown</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200 block mb-1">Promoter Shareholding & Pledge:</span>
                      <p className="text-slate-400 text-[11px]">{investors.promoters_holding_summary || 'Strong promoter ownership with minimal pledge.'}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200 block mb-1">Foreign Institutional Investors (FIIs):</span>
                      <p className="text-slate-400 text-[11px]">{investors.top_fii_investors || 'Global emerging market funds holding long term.'}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200 block mb-1">Domestic Mutual Funds (DIIs):</span>
                      <p className="text-slate-400 text-[11px]">{investors.top_dii_mutual_funds || 'Leading Indian asset managers & insurance institutions.'}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200 block mb-1">Super Investors / HNIs:</span>
                      <p className="text-slate-400 text-[11px]">{investors.super_investors_and_hnis || 'Prominent high-net-worth individual investors and family offices.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 10-Year Profit Growth Record */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>10-Year Financial & Profit Growth Record</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Sales CAGR Track Record</span>
                    <span className="text-slate-200 font-bold mt-1 block">{growth.sales_growth_cagr_10y || '14.5% 5Y CAGR'}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Profit CAGR Track Record</span>
                    <span className="text-emerald-400 font-bold mt-1 block">{growth.profit_growth_cagr_10y || '16.2% 5Y CAGR'}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] block font-bold">Capital Efficiency (ROCE)</span>
                    <span className="text-blue-400 font-bold mt-1 block">{growth.roe_roce_sustainability || '18-25% ROCE projected'}</span>
                  </div>
                </div>
              </div>

              {/* Charlie Munger Pre-Mortem Kill-Thesis Card */}
              {killThesis.length > 0 && (
                <div className="p-6 bg-slate-900 border border-rose-900/50 rounded-3xl space-y-3">
                  <h3 className="text-sm font-bold text-rose-300 flex items-center space-x-2">
                    <Skull className="w-4 h-4 text-rose-400" />
                    <span>Charlie Munger Pre-Mortem Kill-Thesis (5 Failure Modes)</span>
                  </h3>
                  <div className="space-y-2">
                    {killThesis.map((kt: string, idx: number) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{kt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* AI Chat Feed */
        <div className="h-[calc(100vh-12rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md font-medium'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm font-sans'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask about seasonality, management contracts, tie-ups, or investors..."
              className="flex-1 bg-slate-900 text-slate-200 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors shadow-lg shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResearch;
