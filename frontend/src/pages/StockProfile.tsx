import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StockPrice, StockScore } from '../types';
import { stocksApi } from '../api';
import { StockHeader } from '../components/stock/StockHeader';
import { StockTabs } from '../components/stock/StockTabs';
import { OverviewTab } from '../components/stock/OverviewTab';
import { FinancialsTab } from '../components/stock/FinancialsTab';
import { ValuationTab } from '../components/stock/ValuationTab';
import { HealthTab } from '../components/stock/HealthTab';
import { TechnicalsTab } from '../components/stock/TechnicalsTab';
import { EarningsTab } from '../components/stock/EarningsTab';
import { DividendsTab } from '../components/stock/DividendsTab';
import { NewsTab } from '../components/stock/NewsTab';
import { PeersTab } from '../components/stock/PeersTab';
import { AIAnalysisTab } from '../components/stock/AIAnalysisTab';
import { ProResearchReportView } from '../components/stock/ProResearchReportView';
import { PerformanceVersusBenchmark } from '../components/stock/PerformanceVersusBenchmark';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';

export const StockProfile: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [priceData, setPriceData] = useState<StockPrice | null>(null);
  const [scoreData, setScoreData] = useState<StockScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setError(false);

    Promise.all([
      stocksApi.getProfile(ticker),
      stocksApi.getScore(ticker).catch(() => undefined),
    ])
      .then(([priceRes, scoreRes]) => {
        setPriceData(priceRes);
        if (scoreRes) setScoreData(scoreRes);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSkeleton />;
  if (error || !priceData || !ticker) {
    return <ErrorState title="Stock Not Found" message={`Could not retrieve research profile for ticker '${ticker}'.`} />;
  }

  return (
    <div>
      <StockHeader priceData={priceData} scoreData={scoreData || undefined} />
      <StockTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {activeTab === 'overview' && <OverviewTab priceData={priceData} scoreData={scoreData || undefined} />}
        {activeTab === 'pro-research' && <ProResearchReportView initialTicker={ticker} />}
        {activeTab === 'benchmark-return' && <PerformanceVersusBenchmark selectedTicker={ticker} />}
        {activeTab === 'financials' && <FinancialsTab ticker={ticker} />}
        {activeTab === 'valuation' && <ValuationTab ticker={ticker} />}
        {activeTab === 'health' && <HealthTab ticker={ticker} />}
        {activeTab === 'technicals' && <TechnicalsTab ticker={ticker} />}
        {activeTab === 'earnings' && <EarningsTab ticker={ticker} />}
        {activeTab === 'dividends' && <DividendsTab ticker={ticker} />}
        {activeTab === 'news' && <NewsTab ticker={ticker} />}
        {activeTab === 'peers' && <PeersTab ticker={ticker} />}
        {activeTab === 'ai-analysis' && <AIAnalysisTab ticker={ticker} />}
      </div>
    </div>
  );
};
