export type QuoteMap = Record<string, number>;

export const fetchLiveQuotes = async (tickers: string[]): Promise<QuoteMap> => {
  if (tickers.length === 0) return {};
  const symbols = Array.from(new Set(tickers)).join(',');
  const resp = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`);
  if (!resp.ok) throw new Error('quotes_error');
  const json = await resp.json();
  const map: QuoteMap = {};
  for (const q of json?.quoteResponse?.result ?? []) {
    if (typeof q?.symbol === 'string' && Number.isFinite(q?.regularMarketPrice)) map[q.symbol] = q.regularMarketPrice;
  }
  return map;
};

export const fetchMepUsd = async (): Promise<number> => {
  const resp = await fetch('https://dolarapi.com/v1/dolares/bolsa');
  if (!resp.ok) throw new Error('mep_error');
  const json = await resp.json();
  if (!Number.isFinite(json?.venta)) throw new Error('mep_invalid');
  return Number(json.venta);
};
