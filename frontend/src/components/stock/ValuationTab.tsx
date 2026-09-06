import React, { useEffect, useState } from 'react';
import { ValuationScenarios } from '../../types';
import { ValuationChart } from '../charts/ValuationChart';
import { stocksApi } from '../../api';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface ValuationTabProps {
  ticker: string;
}

export const ValuationTab: React.FC<ValuationTabProps> = ({ ticker }) => {
  const [data, setData] = useState<ValuationScenarios | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksApi.getValuation(ticker)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <div className="text-xs text-slate-400">Valuation data unavailable.</div>;

  return (
    <div className="space-y-6">
      <ValuationChart scenarios={data} />
    </div>
  );
};
