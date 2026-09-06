import React, { useEffect, useState } from 'react';
import { newsApi } from '../api';
import { NewsArticle } from '../types';
import { Newspaper, ExternalLink } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    newsApi.getMarket().then(setArticles).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <span>Market News & Catalyst Feed</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Aggregated company news classified by NLP sentiment analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{item.source_name}</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded capitalize ${
                  item.sentiment_label === 'positive' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                  item.sentiment_label === 'negative' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.sentiment_label}
                </span>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-1.5 leading-snug">
                <span>{item.headline}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
              <p className="text-xs text-slate-400 mt-2">{item.summary}</p>
            </div>
            <span className="text-[10px] text-slate-500 mt-4 block">{new Date(item.published_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
