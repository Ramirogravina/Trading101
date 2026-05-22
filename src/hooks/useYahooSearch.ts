import { useEffect, useState } from 'react';

export type SearchQuote = {
  symbol: string;
  shortname: string;
  exchange?: string;
};

export const useYahooSearch = (query: string) => {
  const [results, setResults] = useState<SearchQuote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const endpoints = [
          `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=20&newsCount=0`,
          `https://cors.isomorphic-git.org/https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=20&newsCount=0`,
        ];
        let quotes: SearchQuote[] = [];
        for (const url of endpoints) {
          try {
            const res = await fetch(url, { signal: ctrl.signal });
            if (!res.ok) continue;
            const data = await res.json();
            quotes = (data?.quotes ?? []).filter((q: SearchQuote) => q.symbol && q.shortname);
            if (quotes.length) break;
          } catch {
            // try next endpoint
          }
        }
        setResults(quotes.slice(0, 20));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    const t = window.setTimeout(run, 250);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [query]);

  return { results, loading };
};
