import React, { useEffect, useState } from 'react';
import { AIAnalysis } from '../../types';
import { aiApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Bot, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface AIAnalysisTabProps {
  ticker: string;
}

export const AIAnalysisTab: React.FC<AIAnalysisTabProps> = ({ ticker }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiApi.analyze(ticker)
      .then((res) => setAnalysis(res))
      .catch(() => setAnalysis(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;
  if (!analysis) return <div className="text-xs text-slate-400">AI analysis unavailable.</div>;

  return (
    <div className="space-y-6">
      {/* Executive Verdict Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">AI Executive Research Verdict</h3>
            <span className="text-[10px] text-slate-400">Model Confidence: {analysis.confidence}</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-100 leading-relaxed">{analysis.verdict}</p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Quality</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{analysis.business_quality}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Financial Health & Solvency</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{analysis.financial_health}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Valuation Assessment</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{analysis.valuation}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical & Momentum</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{analysis.technical_picture}</p>
        </div>
      </div>

      {/* Risks Section */}
      <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-5">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span>Key Investment Risks</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {analysis.risks.map((risk, i) => (
            <li key={i} className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources Footnote */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-4">
        <span>Sources: {analysis.sources.join(', ')}</span>
        <span>Data Timestamp: {analysis.data_timestamp}</span>
      </div>
    </div>
  );
};
