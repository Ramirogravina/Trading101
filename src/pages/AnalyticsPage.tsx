import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useYahooSearch } from '../hooks/useYahooSearch';
import { WatchlistItem } from '../types/portfolio';

export const AnalyticsPage = ({
  watchlist, onAddWatch, onDeleteWatch, getLivePrice, dayChangePct,
}: {
  watchlist: WatchlistItem[];
  onAddWatch: (w: WatchlistItem) => void;
  onDeleteWatch: (symbol: string) => void;
  getLivePrice: (ticker: string, fallback: number) => number;
  dayChangePct: Record<string, number>;
}) => {
  const [query, setQuery] = useState('');
  const { results } = useYahooSearch(query);
  const addFirstResult = () => {
    if (!results.length) return;
    const first = results[0];
    onAddWatch({ symbol: first.symbol, name: first.shortname, exchange: first.exchange });
  };
  return <section className="page"><h1>Analytics</h1>
    <div className="section-title"><h2>Market Watchlist</h2></div>
    <form onSubmit={(e) => { e.preventDefault(); addFirstResult(); }}>
      <label>Buscar activo<input placeholder="Ej: Microsoft, Tesla, AL30..." value={query} onChange={(e) => setQuery(e.target.value)} /></label>
    </form>
    <div className="suggestions">{results.map((r) => <button key={r.symbol} type="button" className="suggestion-item" onClick={() => onAddWatch({ symbol: r.symbol, name: r.shortname, exchange: r.exchange })}><Plus size={14} /> {r.shortname} ({r.symbol})</button>)}</div>
    {!watchlist.length && <p className="muted">Watchlist vacía. Buscá activos arriba y agregalos con +.</p>}
    <div className="list">{watchlist.map((w) => {
      const px = getLivePrice(w.symbol.replace('.BA', ''), 0);
      const day = dayChangePct[w.symbol.replace('.BA', '')] ?? 0;
      return <article className="card holding" key={w.symbol}>
        <div><strong>{w.symbol}</strong><p>{w.name}</p></div>
        <div><p>{px > 0 ? px.toFixed(2) : '-'}</p><p className={day >= 0 ? 'pos' : 'neg'}>{day.toFixed(2)}%</p><button onClick={() => onDeleteWatch(w.symbol)}>Delete</button></div>
      </article>;
    })}</div>
  </section>;
};
