export interface LiveQuoteResult {
  ticker: string;
  symbol: string;
  price: number;
  change_pct: number;
  open: number;
  high: number;
  low: number;
  week_52_high: number;
  week_52_low: number;
  currency: string;
  exchange: string;
  name?: string;
  history: Array<{ date: string; close: number }>;
}

export interface SymbolSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export async function searchLiveSymbols(query: string): Promise<SymbolSearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const targetUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;

  const processQuotes = (quotes: any[]) => {
    return quotes
      .filter((q) => q.symbol && (q.quoteType === 'EQUITY' || !q.quoteType))
      .map((q) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchDisp || q.exchange || 'NSE',
        type: q.quoteType || 'EQUITY',
      }))
      .slice(0, 8);
  };

  try {
    const res = await fetch(targetUrl);
    if (res.ok) {
      const json = await res.json();
      if (json?.quotes) return processQuotes(json.quotes);
    }
  } catch (e) {
    // Proxy fallback
  }

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const json = await res.json();
      if (json?.quotes) return processQuotes(json.quotes);
    }
  } catch (e) {
    // Ignore
  }

  return [];
}

export async function fetchTimeframeChart(
  ticker: string,
  timeframe: '1min' | '1h' | '1d' | '1w' | '1m'
): Promise<Array<{ date: string; close: number }>> {
  if (!ticker) return [];
  const cleanTicker = ticker.trim().toUpperCase().replace('.NS', '').replace('.BO', '');
  const symbolsToTry = [`${cleanTicker}.NS`, `${cleanTicker}.BO`, cleanTicker];

  let interval = '1d';
  let range = '1mo';

  if (timeframe === '1min') {
    interval = '1m';
    range = '1d';
  } else if (timeframe === '1h') {
    interval = '60m';
    range = '1mo';
  } else if (timeframe === '1d') {
    interval = '15m';
    range = '1d';
  } else if (timeframe === '1w') {
    interval = '1d';
    range = '5d';
  } else if (timeframe === '1m') {
    interval = '1d';
    range = '1mo';
  }

  for (const symbol of symbolsToTry) {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

    const processJson = (json: any) => {
      const result = json?.chart?.result?.[0];
      if (!result) return null;
      const timestamps: number[] = result.timestamp || [];
      const closes: (number | null)[] = result.indicators?.quote?.[0]?.close || [];

      return timestamps
        .map((ts, idx) => {
          const val = closes[idx];
          if (val == null || isNaN(val)) return null;
          const d = new Date(ts * 1000);
          const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = d.toISOString().split('T')[0];
          return {
            date: timeframe === '1min' || timeframe === '1d' ? timeStr : dateStr,
            close: Math.round(val * 100) / 100,
          };
        })
        .filter((item): item is { date: string; close: number } => item !== null);
    };

    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const json = await res.json();
        const chartData = processJson(json);
        if (chartData && chartData.length > 0) return chartData;
      }
    } catch (e) {}

    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        const chartData = processJson(json);
        if (chartData && chartData.length > 0) return chartData;
      }
    } catch (e) {}
  }

  return [];
}

export async function fetchLiveMarketQuote(ticker: string): Promise<LiveQuoteResult | null> {
  if (!ticker) return null;
  const cleanTicker = ticker.trim().toUpperCase().replace('.NS', '').replace('.BO', '');
  const symbolsToTry = [`${cleanTicker}.NS`, `${cleanTicker}.BO`, cleanTicker];

  for (const symbol of symbolsToTry) {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;

    // Attempt 1: Direct fetch
    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const json = await res.json();
        const parsed = parseYahooChartJson(cleanTicker, symbol, json);
        if (parsed && parsed.price > 0) return parsed;
      }
    } catch (e) {
      // Ignore CORS or network error & try proxy
    }

    // Attempt 2: AllOrigins proxy fallback
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        const parsed = parseYahooChartJson(cleanTicker, symbol, json);
        if (parsed && parsed.price > 0) return parsed;
      }
    } catch (e) {
      // Ignore & try next symbol
    }
  }

  return null;
}

export async function resolveSymbolAndQuote(query: string): Promise<LiveQuoteResult | null> {
  if (!query || !query.trim()) return null;

  // First try direct quote if already a clean ticker format
  const direct = await fetchLiveMarketQuote(query);
  if (direct && direct.price > 0) return direct;

  // Search symbols via query API
  const suggestions = await searchLiveSymbols(query);
  if (suggestions.length > 0) {
    // Prefer NSE / BSE symbols
    const nseQuote = suggestions.find((s) => s.symbol.endsWith('.NS') || s.symbol.endsWith('.BO'));
    const chosen = nseQuote || suggestions[0];
    const quote = await fetchLiveMarketQuote(chosen.symbol);
    if (quote) {
      return {
        ...quote,
        name: chosen.name || quote.name,
      };
    }
  }

  return null;
}

function parseYahooChartJson(ticker: string, symbol: string, json: any): LiveQuoteResult | null {
  try {
    const result = json?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? meta.chartPreviousClose;
    if (price == null || isNaN(price)) return null;

    const prevClose = meta.chartPreviousClose ?? price;
    const change_pct = prevClose ? Math.round(((price - prevClose) / prevClose) * 10000) / 100 : 0;

    const timestamps: number[] = result.timestamp || [];
    const closes: (number | null)[] = result.indicators?.quote?.[0]?.close || [];

    const history = timestamps
      .map((ts, idx) => {
        const val = closes[idx];
        if (val == null || isNaN(val)) return null;
        return {
          date: new Date(ts * 1000).toISOString().split('T')[0],
          close: Math.round(val * 100) / 100,
        };
      })
      .filter((item): item is { date: string; close: number } => item !== null);

    return {
      ticker,
      symbol,
      price: Math.round(price * 100) / 100,
      change_pct,
      open: meta.regularMarketDayLow ? Math.round(meta.regularMarketDayLow * 100) / 100 : Math.round(price * 100) / 100,
      high: meta.regularMarketDayHigh ? Math.round(meta.regularMarketDayHigh * 100) / 100 : Math.round(price * 100) / 100,
      low: meta.regularMarketDayLow ? Math.round(meta.regularMarketDayLow * 100) / 100 : Math.round(price * 100) / 100,
      week_52_high: meta.fiftyTwoWeekHigh ? Math.round(meta.fiftyTwoWeekHigh * 100) / 100 : Math.round(price * 1.2 * 100) / 100,
      week_52_low: meta.fiftyTwoWeekLow ? Math.round(meta.fiftyTwoWeekLow * 100) / 100 : Math.round(price * 0.8 * 100) / 100,
      currency: meta.currency || 'INR',
      exchange: meta.exchangeName || 'NSE',
      name: meta.shortName || meta.longName || `${ticker} Equity`,
      history,
    };
  } catch (e) {
    return null;
  }
}
