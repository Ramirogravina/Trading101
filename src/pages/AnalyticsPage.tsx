import { Holding } from '../types/portfolio';

export const AnalyticsPage = ({ holdings }: { holdings: Holding[] }) => {
  const best = [...holdings].sort((a, b) => b.returnPct - a.returnPct)[0];
  const worst = [...holdings].sort((a, b) => a.returnPct - b.returnPct)[0];
  return <section className="page"><h1>Analytics</h1><div className="stats-grid">
    <article className="card"><p>Best performer</p><h3>{best?.ticker ?? '-'}</h3><p>{best?.returnPct.toFixed(2)}%</p></article>
    <article className="card"><p>Worst performer</p><h3>{worst?.ticker ?? '-'}</h3><p>{worst?.returnPct.toFixed(2)}%</p></article>
  </div></section>;
};
