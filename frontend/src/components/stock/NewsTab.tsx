import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../../types';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { ExternalLink } from 'lucide-react';

interface NewsTabProps {
  ticker: string;
}

export const NewsTab: React.FC<NewsTabProps> = ({ ticker }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksApi.getNews(ticker)
      .then((res) => setArticles(res))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-3">
      {articles.map((item) => (
        <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{item.source_name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                item.sentiment_label === 'positive' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                item.sentiment_label === 'negative' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {item.sentiment_label}
              </span>
            </div>
            <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>{item.headline}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
            <p className="text-xs text-slate-400 mt-1.5">{item.summary}</p>
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">{item.published_at}</span>
        </div>
      ))}
    </div>
  );
};
