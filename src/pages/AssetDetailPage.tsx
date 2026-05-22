import { Holding } from '../types/portfolio';
import { useParams } from 'react-router-dom';

export const AssetDetailPage = ({ holdings }: { holdings: Holding[] }) => {
  const { ticker } = useParams();
  const h = holdings.find((it) => it.ticker === ticker);
  if (!h) return <section className="page"><p>Asset no encontrado.</p></section>;
  return <section className="page"><h1>{h.ticker}</h1><div className="card">
    <p>Shares: {h.shares.toFixed(4)}</p><p>Average cost: ${h.avgCost.toFixed(2)}</p><p>Current price: ${h.currentPrice.toFixed(2)}</p><p>Current value: ${h.currentValue.toFixed(2)}</p>
  </div></section>;
};
