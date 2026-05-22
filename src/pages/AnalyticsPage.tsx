import { Holding } from '../types/portfolio';
import { mockAssets } from '../data/mockAssets';

export const AnalyticsPage = ({ holdings: _holdings }: { holdings: Holding[] }) => {
  return <section className="page"><h1>Analytics</h1>
    <div className="list">{mockAssets.map((asset) => <article className="card holding" key={asset.ticker}>
      <div><strong>{asset.ticker}</strong><p>{asset.type}</p></div>
      <div><p>{asset.name}</p><p>{asset.currency} {asset.currentPrice.toFixed(2)}</p></div>
    </article>)}</div>
  </section>;
};
