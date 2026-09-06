import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { MetricCard } from '../components/common/MetricCard';
import { ShieldAlert, Server, Activity, Database } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    adminApi.getStatus().then(setStatus).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span>System & Data Provider Health Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Monitor API statuses, data freshness, rate limits, and database connectivity.</p>
      </div>

      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="System Status" value={status.status.toUpperCase()} icon={<Server className="w-5 h-5" />} />
          <MetricCard label="Data Mode" value={status.data_provider_mode.toUpperCase()} icon={<Activity className="w-5 h-5" />} />
          <MetricCard label="API Requests (24h)" value={status.api_requests_24h.toLocaleString()} />
          <MetricCard label="AI Tokens Used" value={status.ai_tokens_used_24h.toLocaleString()} />
        </div>
      )}

      {status && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Provider Interfaces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {Object.entries(status.providers).map(([k, v]) => (
              <div key={k} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="capitalize font-semibold text-slate-300">{k.replace('_', ' ')}</span>
                <span className="font-bold text-emerald-400">{v as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
