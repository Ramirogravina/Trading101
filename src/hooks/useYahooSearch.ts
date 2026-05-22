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
        const endpoint = import.meta.env.VITE_YAHOO_SEARCH_PROXY || '/api/yahoo-search';
        const sep = endpoint.includes('?') ? '&' : '?';
        const res = await fetch(`${endpoint}${sep}q=${encodeURIComponent(query)}&quotesCount=20`, { signal: ctrl.signal });
        if (!res.ok) throw new Error('Search error');
        const data = await res.json();
        const quotes: SearchQuote[] = (data?.quotes ?? []).filter((q: SearchQuote) => q.symbol && q.shortname);
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
