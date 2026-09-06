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
  history: Array<{ date: string; close: number }>;
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
      history,
    };
  } catch (e) {
    return null;
  }
}
