import { useEffect, useMemo, useState } from 'react';
import { mockAssets } from '../data/mockAssets';
import { Transaction } from '../types/portfolio';

type QuoteMap = Record<string, number>;

const getYahooSymbol = (ticker: string, currency: 'USD' | 'ARS') => {
  if (currency === 'ARS') return `${ticker}.BA`;
  return ticker;
};

export const useMarketData = (transactions: Transaction[]) => {
  const [quotes, setQuotes] = useState<QuoteMap>({});
  const [mepUsd, setMepUsd] = useState<number>(1200);

  const uniqueTickers = useMemo(() => {
    const fromTx = transactions.map((tx) => `${tx.ticker}:${tx.currency}`);
    const fromMock = mockAssets.map((a) => `${a.ticker}:${a.currency}`);
    return Array.from(new Set([...fromTx, ...fromMock]));
  }, [transactions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yahooSymbols = uniqueTickers.map((key) => {
          const [ticker, currency] = key.split(':') as [string, 'USD' | 'ARS'];
          return getYahooSymbol(ticker, currency);
        }).join(',');
        const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yahooSymbols)}`);
        const data = await res.json();
        const next: QuoteMap = {};
        (data?.quoteResponse?.result ?? []).forEach((q: { symbol: string; regularMarketPrice?: number }) => {
          if (typeof q.regularMarketPrice !== 'number') return;
          const base = q.symbol.replace('.BA', '');
          next[base] = q.regularMarketPrice;
        });
        setQuotes(next);
      } catch {
        // keep fallback prices
      }

      try {
        const res = await fetch('https://dolarapi.com/v1/dolares/bolsa');
        const data = await res.json();
        if (typeof data?.venta === 'number') setMepUsd(data.venta);
      } catch {
        // keep default/fallback
      }
    };

    fetchData();
    const id = window.setInterval(fetchData, 60_000);
    return () => window.clearInterval(id);
  }, [uniqueTickers]);

  const getLivePrice = (ticker: string, fallback: number) => quotes[ticker] ?? fallback;

  return { getLivePrice, mepUsd };
};
