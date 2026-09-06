import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Minimize2,
  Activity,
  Gauge,
  Info,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart
} from 'recharts';
import {
  ProResearchDossier,
  getProResearchDossier,
  PRO_RESEARCH_DATABASE
} from '../../data/proResearchData';

interface ProResearchReportViewProps {
  initialTicker?: string;
  onClose?: () => void;
}

export const ProResearchReportView: React.FC<ProResearchReportViewProps> = ({
  initialTicker = 'ELEO',
  onClose
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(initialTicker);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'paged' | 'continuous'>('continuous');
  const [userRating, setUserRating] = useState<string | null>(null);

  const dossier = getProResearchDossier(selectedTicker);

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(150, Math.max(75, prev + delta)));
  };

  // Speedometer angle calculation for 0 - 5 score (0deg = Strong Sell, 180deg = Strong Buy)
  const technicalScore = dossier.momentumTechnicals.technicalScore || 4.4;
  const needleAngle = Math.min(180, Math.max(0, (technicalScore / 5.0) * 180));

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16 font-sans">
      {/* Top Document Viewer Navigation Toolbar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md print:hidden">
        <div className="flex items-center space-x-3">
          {/* Page Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-700 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 && viewMode === 'paged'}
              className="px-1.5 py-0.5 hover:text-white disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              {viewMode === 'paged' ? `${currentPage} / 2` : 'Full Dossier (2 Pages)'}
            </span>
            <button
              onClick={() => setCurrentPage(2)}
              disabled={currentPage === 2 && viewMode === 'paged'}
              className="px-1.5 py-0.5 hover:text-white disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-700 text-xs font-semibold text-slate-300 space-x-2">
            <button
              onClick={() => handleZoom(-10)}
              className="hover:text-white p-0.5"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span>{zoomLevel}%</span>
            <button
              onClick={() => handleZoom(10)}
              className="hover:text-white p-0.5"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setViewMode('continuous')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'continuous'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Pages
            </button>
            <button
              onClick={() => setViewMode('paged')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'paged'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Page View
            </button>
          </div>
        </div>

        {/* Stock Switcher Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs text-slate-400 font-medium">Select Research Dossier:</label>
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="bg-slate-800 border border-blue-500/40 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ELEO">Electronics Mart India (NSE: ELEO)</option>
            <option value="ANDHRSUGAR">Andhra Sugars (NSE: ANDHRSUGAR)</option>
            <option value="TATAMOTORS">Tata Motors (NSE: TATAMOTORS)</option>
            <option value="COALINDIA">Coal India (NSE: COALINDIA)</option>
            <option value="RECLTD">REC Limited (NSE: RECLTD)</option>
            <option value="BPCL">Bharat Petroleum (NSE: BPCL)</option>
            <option value="JAMNAAUTO">Jamna Auto (NSE: JAMNAAUTO)</option>
            <option value="BCLIND">BCL Industries (NSE: BCLIND)</option>
            <option value="CONFIPET">Confidence Petroleum (NSE: CONFIPET)</option>
          </select>

          {/* Action buttons */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition-all"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Print / PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
            >
              Close Dossier
            </button>
          )}
        </div>
      </div>

      {/* Main Printable Document Canvas Container */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6" style={{ zoom: `${zoomLevel}%` }}>
        {/* ========================================================================= */}
        {/* PAGE 1: Executive Brief, Indicators & 5-Year Multi-Axis Combo Chart       */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || currentPage === 1) && (
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden mb-8 print:shadow-none print:border-none print:mb-0 print:break-after-page">
            {/* Report Header Bar */}
            <div className="bg-[#0b1b3a] text-white px-6 py-3.5 flex flex-wrap items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <h1 className="text-xl font-extrabold tracking-tight">
                  {dossier.name} <span className="text-blue-300">({dossier.exchange}:{dossier.ticker})</span>
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Rating Widget */}
                <div className="hidden sm:flex items-center space-x-1 text-xs bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  <span className="text-slate-400 mr-1">Rate your experience:</span>
                  {(['😀', '🙂', '😐', '🙁', '🤬'] as const).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setUserRating(emoji)}
                      className={`hover:scale-125 transition-transform ${
                        userRating === emoji ? 'scale-125 bg-blue-500/40 rounded' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Pro Research Watermark Branding */}
                <div className="flex items-center space-x-1.5 text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded">
                  <span className="text-white font-extrabold tracking-wide">Investing.com</span>
                  <span className="text-amber-400 flex items-center">
                    <Sparkles className="w-3 h-3 mr-0.5 text-amber-400" /> Pro Research
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* SECTION 1: Key Indicators Grid Table */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 mb-3">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center">
                    <BarChart2 className="w-4 h-4 mr-1.5 text-blue-600" /> Key Indicators:
                  </h3>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-slate-500">
                      🕒 Date: <strong className="text-slate-700">{dossier.keyIndicators.date}</strong>
                    </span>
                    <span className="text-slate-500">
                      Stock Price:{' '}
                      <strong className="text-emerald-700 font-extrabold text-sm">
                        ₹{dossier.keyIndicators.stockPrice.toFixed(2)}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* 3-Column 6-Row Metric Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
                  {/* Column 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">52-Week Range</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.week52Range}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Market Cap</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.marketCap}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">P/E Ratio</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.peRatio}x</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">P/E (Fwd.)</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.peFwd}x</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">EPS Actual</span>
                      <span className="font-bold text-slate-900">₹{dossier.keyIndicators.epsActual}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-600">EPS Estimate</span>
                      <span className="font-bold text-slate-900">₹{dossier.keyIndicators.epsEstimate}</span>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">EPS Revisions (90D)</span>
                      <span className="font-bold text-slate-900 flex items-center">
                        <span className="text-emerald-600 mr-1.5">↑ {dossier.keyIndicators.epsRevisions90d.up}</span>
                        <span className="text-rose-600">↓ {dossier.keyIndicators.epsRevisions90d.down}</span>
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">PEG Ratio</span>
                      <span className="font-bold text-emerald-700">{dossier.keyIndicators.pegRatio}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">FCF Yield</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.fcfYield}%</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">EV / EBITDA</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.evEbitda}x</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Book / Share</span>
                      <span className="font-bold text-slate-900">₹{dossier.keyIndicators.bookPerShare}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-600">Beta (5Y)</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.beta5y}</span>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Revenue</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.revenue}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Revenue Forecast</span>
                      <span className="font-bold text-blue-700">{dossier.keyIndicators.revenueForecast}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">1-Year Change</span>
                      <span
                        className={`font-bold ${
                          dossier.keyIndicators.oneYearChange >= 0
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {dossier.keyIndicators.oneYearChange >= 0 ? '+' : ''}
                        {dossier.keyIndicators.oneYearChange}%
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Div Yield</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.divYield}%</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Div. Growth Streak</span>
                      <span className="font-bold text-slate-900">{dossier.keyIndicators.divGrowthStreak}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-600">Next Earnings</span>
                      <span className="font-bold text-blue-700">{dossier.keyIndicators.nextEarnings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 5-Year Multi-Axis Multi-Series Combo Chart */}
              <div>
                <div className="flex flex-wrap items-center justify-between border-b border-slate-300 pb-1.5 mb-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    5-Year Performance & Forecast Chart
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center text-blue-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block mr-1"></span> Price(Adj.), INR
                    </span>
                    <span className="flex items-center text-amber-700">
                      <span className="w-2.5 h-2.5 bg-amber-500 inline-block mr-1"></span> Analyst Target, INR
                    </span>
                    <span className="flex items-center text-emerald-700">
                      <span className="w-2.5 h-2.5 bg-emerald-500 inline-block mr-1"></span> Revenue, INR
                    </span>
                    <span className="flex items-center text-rose-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mr-1"></span> EPS, INR
                    </span>
                  </div>
                </div>

                <div className="w-full h-72 bg-slate-50/50 p-2 rounded-lg border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dossier.fiveYearChart} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                      {/* Left Axis: Revenue (INR Cr) */}
                      <YAxis
                        yAxisId="left"
                        stroke="#059669"
                        fontSize={10}
                        tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                      />
                      {/* Right Axis: Price & EPS */}
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#2563eb"
                        fontSize={10}
                        tickFormatter={(val) => `₹${val}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          color: '#f8fafc',
                          borderColor: '#334155',
                          borderRadius: '0.5rem',
                          fontSize: '11px',
                        }}
                        formatter={(val: any, name: string) => {
                          if (name === 'Revenue (Cr)') return [`₹${val.toLocaleString()} Cr`, name];
                          if (name === 'Price (Adj.)') return [`₹${val}`, name];
                          if (name === 'Analyst Target') return [`₹${val}`, name];
                          if (name === 'EPS') return [`₹${val}`, name];
                          return [val, name];
                        }}
                      />
                      {/* Revenue Bars (Green) */}
                      <Bar
                        yAxisId="left"
                        dataKey="revenueCr"
                        name="Revenue (Cr)"
                        fill="#86efac"
                        stroke="#22c55e"
                        radius={[3, 3, 0, 0]}
                        opacity={0.7}
                      />
                      {/* Price Adj Line (Blue) */}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="priceAdj"
                        name="Price (Adj.)"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#2563eb' }}
                      />
                      {/* Analyst Target Line (Orange Stepped) */}
                      <Line
                        yAxisId="right"
                        type="stepAfter"
                        dataKey="analystTarget"
                        name="Analyst Target"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={false}
                      />
                      {/* EPS Line (Red) */}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="eps"
                        name="EPS"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 2.5, fill: '#ef4444' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Analyst Consensus Forecast Targets */}
                <div className="flex justify-end space-x-4 text-[11px] text-slate-600 mt-1 font-medium">
                  <span>Analyst High: <strong className="text-emerald-700">₹252.00</strong></span>
                  <span>Analyst Avg: <strong className="text-blue-700">₹199.25</strong></span>
                  <span>Analyst Low: <strong className="text-rose-700">₹138.00</strong></span>
                </div>
              </div>

              {/* SECTION 3: Executive Summary & Right Column Scorecards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Left 2 Columns: Executive Summary */}
                <div className="lg:col-span-2 space-y-3 text-xs leading-relaxed text-slate-700">
                  <div className="flex items-center space-x-2 border-b border-slate-300 pb-1">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Executive Summary
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-300 flex items-center">
                      <Sparkles className="w-3 h-3 mr-0.5 text-blue-600" /> Warren AI Synthesized
                    </span>
                  </div>

                  <p>{dossier.executiveSummary.companyDescription}</p>

                  <p>
                    <strong className="text-slate-900">Market Position: </strong>
                    <span className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-medium border border-amber-300">
                      {dossier.executiveSummary.marketPosition}
                    </span>
                  </p>

                  <p>
                    <strong className="text-slate-900">Recent Performance: </strong>
                    <span className="bg-emerald-50 text-emerald-950 px-1 py-0.5 rounded font-medium">
                      {dossier.executiveSummary.recentPerformance}
                    </span>
                  </p>

                  <p>
                    <strong className="text-slate-900">Growth Prospects: </strong>
                    {dossier.executiveSummary.growthProspects}
                  </p>

                  <p>
                    <strong className="text-slate-900">Financial Health & Risks: </strong>
                    {dossier.executiveSummary.financialHealthRisks}
                  </p>
                </div>

                {/* Right Column: Fair Value & Financial Health Scorecards */}
                <div className="space-y-4">
                  {/* Fair Value Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-blue-600" /> Fair Value
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">DCF & Multiples</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-600">Model Upside:</span>
                        <span className="text-sm font-black text-emerald-700">
                          +{dossier.fairValue.upsidePct}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-600">Fair Value Price:</span>
                        <span className="text-sm font-black text-blue-700">
                          ₹{dossier.fairValue.fairValuePrice.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 italic text-center pt-1">
                        {dossier.fairValue.valuationModel}
                      </p>
                    </div>
                  </div>

                  {/* Financial Health Ratings */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> Financial Health
                      </h4>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {dossier.financialHealth.healthScoreOverall}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Growth Rating */}
                      <div>
                        <div className="flex justify-between mb-1 font-semibold">
                          <span className="text-slate-700">Growth Rating:</span>
                          <span className="text-emerald-700 font-bold">
                            {dossier.financialHealth.growthRating} / 10
                          </span>
                        </div>
                        {/* 5-Segmented Bar */}
                        <div className="grid grid-cols-5 gap-1 h-2">
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-amber-400 rounded-sm"></div>
                        </div>
                      </div>

                      {/* Profitability Rating */}
                      <div>
                        <div className="flex justify-between mb-1 font-semibold">
                          <span className="text-slate-700">Profitability Rating:</span>
                          <span className="text-emerald-700 font-bold">
                            {dossier.financialHealth.profitabilityRating} / 10
                          </span>
                        </div>
                        {/* 5-Segmented Bar */}
                        <div className="grid grid-cols-5 gap-1 h-2">
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-400 rounded-sm"></div>
                          <div className="bg-slate-300 rounded-sm"></div>
                        </div>
                      </div>

                      {/* Cash Flow Rating */}
                      <div>
                        <div className="flex justify-between mb-1 font-semibold">
                          <span className="text-slate-700">Cash Flow Rating:</span>
                          <span className="text-blue-700 font-bold">
                            {dossier.financialHealth.cashFlowRating} / 10
                          </span>
                        </div>
                        {/* 5-Segmented Bar */}
                        <div className="grid grid-cols-5 gap-1 h-2">
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-emerald-500 rounded-sm"></div>
                          <div className="bg-blue-400 rounded-sm"></div>
                          <div className="bg-slate-300 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Footer */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Pro Research Report • Confidential Institutional Grade</span>
              <span>Page 1 / 2</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: Financial Statements Deep-Dive & Momentum Technical Indicators    */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || currentPage === 2) && (
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:break-after-page">
            {/* Header */}
            <div className="bg-[#0b1b3a] text-white px-6 py-3.5 flex flex-wrap items-center justify-between border-b-2 border-amber-500">
              <h2 className="text-lg font-extrabold tracking-tight">
                {dossier.name} <span className="text-blue-300">({dossier.exchange}:{dossier.ticker})</span>
              </h2>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Financial Statements & Momentum Technicals</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* SECTION 1: Financial Statements Matrix with Mini Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Multi-Quarter Table */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Income Statement Table */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center">
                      <BarChart2 className="w-3.5 h-3.5 mr-1 text-blue-600" /> Income Statement (Quarterly)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="py-1.5 px-2">Line Item</th>
                            <th className="py-1.5 px-2 text-right">Q1 2026</th>
                            <th className="py-1.5 px-2 text-right">Q2 2026</th>
                            <th className="py-1.5 px-2 text-right">Q3 2026</th>
                            <th className="py-1.5 px-2 text-right">Q4 2026</th>
                            <th className="py-1.5 px-2 text-right text-blue-700">Q1 2027</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {dossier.financialStatements.incomeStatement.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="py-1 px-2 font-medium text-slate-700">{row.metric}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q1_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q2_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q3_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q4_2026}</td>
                              <td className="py-1 px-2 text-right font-mono font-bold text-blue-700">{row.q1_2027}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Balance Sheet Table */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center">
                      <Layers className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Balance Sheet (Quarterly)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="py-1.5 px-2">Line Item</th>
                            <th className="py-1.5 px-2 text-right">Q1 2026</th>
                            <th className="py-1.5 px-2 text-right">Q2 2026</th>
                            <th className="py-1.5 px-2 text-right">Q3 2026</th>
                            <th className="py-1.5 px-2 text-right">Q4 2026</th>
                            <th className="py-1.5 px-2 text-right text-blue-700">Q1 2027</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {dossier.financialStatements.balanceSheet.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="py-1 px-2 font-medium text-slate-700">{row.metric}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q1_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q2_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q3_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q4_2026}</td>
                              <td className="py-1 px-2 text-right font-mono font-bold text-blue-700">{row.q1_2027}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cash Flow Statement */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center">
                      <Activity className="w-3.5 h-3.5 mr-1 text-purple-600" /> Cash Flow Statement (Quarterly)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="py-1.5 px-2">Line Item</th>
                            <th className="py-1.5 px-2 text-right">Q1 2026</th>
                            <th className="py-1.5 px-2 text-right">Q2 2026</th>
                            <th className="py-1.5 px-2 text-right">Q3 2026</th>
                            <th className="py-1.5 px-2 text-right">Q4 2026</th>
                            <th className="py-1.5 px-2 text-right text-blue-700">Q1 2027</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {dossier.financialStatements.cashFlowStatement.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="py-1 px-2 font-medium text-slate-700">{row.metric}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q1_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q2_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q3_2026}</td>
                              <td className="py-1 px-2 text-right font-mono">{row.q4_2026}</td>
                              <td className="py-1 px-2 text-right font-mono font-bold text-blue-700">{row.q1_2027}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Statement Mini-Charts */}
                <div className="space-y-4">
                  {/* Chart 1: Net Income, EPS, Shares */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Net Income, EPS & Shares</span>
                      <span className="text-[10px] text-emerald-600 font-mono">Q1 26 - Q1 27</span>
                    </h5>
                    <div className="w-full h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={dossier.financialStatements.quarterlyTrends}>
                          <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
                          <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={9} />
                          <YAxis yAxisId="income" stroke="#10b981" fontSize={9} />
                          <YAxis yAxisId="eps" orientation="right" stroke="#3b82f6" fontSize={9} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              color: '#fff',
                              borderRadius: '0.375rem',
                              fontSize: '10px',
                            }}
                          />
                          <Bar yAxisId="income" dataKey="netIncome" name="Net Income" fill="#86efac" radius={[2, 2, 0, 0]} />
                          <Line yAxisId="eps" type="monotone" dataKey="eps" name="EPS" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Leverage and Debt Profile */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Leverage and Debt Profile</span>
                      <span className="text-[10px] text-amber-600 font-mono">Coverage vs Capital</span>
                    </h5>
                    <div className="w-full h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dossier.financialStatements.quarterlyTrends}>
                          <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
                          <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#64748b" fontSize={9} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              color: '#fff',
                              borderRadius: '0.375rem',
                              fontSize: '10px',
                            }}
                          />
                          <Line type="monotone" dataKey="interestCoverage" name="Interest Coverage" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                          <Line type="monotone" dataKey="debtToCapital" name="Debt / Capital" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Momentum & Technical Indicators */}
              <div className="border-t border-slate-300 pt-5">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-sm"></div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Momentum & Technical Indicators
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Columns: Peer Momentum Comparison Table */}
                  <div className="lg:col-span-2">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                      Price Momentum vs Industry Peers
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="py-1.5 px-3">Metric</th>
                            <th className="py-1.5 px-3 text-right font-black text-blue-700">{dossier.ticker}</th>
                            <th className="py-1.5 px-3 text-right text-slate-600">Percentile</th>
                            <th className="py-1.5 px-3 text-center text-slate-600">Score</th>
                            <th className="py-1.5 px-3 text-right text-slate-500">{dossier.momentumTechnicals.peer1Name}</th>
                            <th className="py-1.5 px-3 text-right text-slate-500">{dossier.momentumTechnicals.peer2Name}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {dossier.momentumTechnicals.momentumRows.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="py-1.5 px-3 font-medium text-slate-700">{row.metric}</td>
                              <td className="py-1.5 px-3 text-right font-black font-mono text-emerald-700">{row.targetValue}</td>
                              <td className="py-1.5 px-3 text-right font-mono text-slate-600">{row.percentile}</td>
                              <td className="py-1.5 px-3 text-center font-bold font-mono">
                                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[11px]">
                                  {row.score}
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono text-slate-500">{row.peer1Value}</td>
                              <td className="py-1.5 px-3 text-right font-mono text-slate-500">{row.peer2Value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Speedometer Technical Summary Dial */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 text-center">
                        Technical Summary
                      </h4>

                      {/* SVG Speedometer Gauge */}
                      <div className="relative w-48 h-28 mx-auto mt-2 flex items-center justify-center">
                        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                          {/* Semicircular Track Segments */}
                          {/* Segment 1: Strong Sell (Red) */}
                          <path
                            d="M 20 100 A 80 80 0 0 1 43.4 43.4"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="14"
                            strokeLinecap="round"
                          />
                          {/* Segment 2: Sell (Orange) */}
                          <path
                            d="M 47.4 39.4 A 80 80 0 0 1 80 22"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="14"
                          />
                          {/* Segment 3: Neutral (Yellow) */}
                          <path
                            d="M 85 21.5 A 80 80 0 0 1 115 21.5"
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="14"
                          />
                          {/* Segment 4: Buy (Light Green) */}
                          <path
                            d="M 120 22 A 80 80 0 0 1 152.6 39.4"
                            fill="none"
                            stroke="#84cc16"
                            strokeWidth="14"
                          />
                          {/* Segment 5: Strong Buy (Dark Green) */}
                          <path
                            d="M 156.6 43.4 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="14"
                            strokeLinecap="round"
                          />

                          {/* Center Hub */}
                          <circle cx="100" cy="100" r="7" fill="#1e293b" />

                          {/* Gauge Needle Pointer */}
                          <g transform={`rotate(${needleAngle - 90} 100 100)`}>
                            <line
                              x1="100"
                              y1="100"
                              x2="100"
                              y2="32"
                              stroke="#0f172a"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            <circle cx="100" cy="30" r="3" fill="#2563eb" />
                          </g>
                        </svg>
                      </div>

                      {/* Speedometer Labels */}
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold px-4 -mt-2">
                        <span className="text-rose-600">Strong Sell</span>
                        <span className="text-amber-500">Neutral</span>
                        <span className="text-emerald-600">Strong Buy</span>
                      </div>
                    </div>

                    {/* Signal Status Badge */}
                    <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                      <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 font-extrabold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{dossier.momentumTechnicals.technicalSignal} ({technicalScore}/5.0)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-2 italic leading-snug">
                        {dossier.momentumTechnicals.trendSummary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 2 Footer */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Pro Research Report • Financial Statements & Momentum Indicators</span>
              <span>Page 2 / 2</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
