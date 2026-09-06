export const formatCurrency = (value: number | null | undefined, currency: string = 'INR', compact = false): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';

  if (compact) {
    if (currency === 'INR') {
      if (Math.abs(value) >= 10000000) return `${symbol}${(value / 10000000).toFixed(2)} Cr`;
      if (Math.abs(value) >= 100000) return `${symbol}${(value / 100000).toFixed(2)} L`;
    }
    if (Math.abs(value) >= 1000000000) return `${symbol}${(value / 1000000000).toFixed(2)}B`;
    if (Math.abs(value) >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
    if (Math.abs(value) >= 1000) return `${symbol}${(value / 1000).toFixed(2)}K`;
  }

  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPct = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number | null | undefined, compact = true): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  if (compact) {
    if (Math.abs(value) >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toLocaleString();
};

export const getChangeColor = (value: number | null | undefined): string => {
  if (!value) return 'text-slate-400';
  return value > 0 ? 'text-emerald-400' : 'text-rose-400';
};

export const getScoreColor = (score: number | null | undefined): string => {
  if (!score) return 'text-slate-400';
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-green-400';
  if (score >= 55) return 'text-yellow-400';
  if (score >= 40) return 'text-amber-500';
  return 'text-rose-500';
};

export const getScoreBgColor = (score: number | null | undefined): string => {
  if (!score) return 'bg-slate-800 text-slate-300';
  if (score >= 85) return 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400';
  if (score >= 70) return 'bg-green-950/60 border-green-500/30 text-green-400';
  if (score >= 55) return 'bg-yellow-950/60 border-yellow-500/30 text-yellow-400';
  if (score >= 40) return 'bg-amber-950/60 border-amber-500/30 text-amber-400';
  return 'bg-rose-950/60 border-rose-500/30 text-rose-400';
};

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};
