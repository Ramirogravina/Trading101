import { Holding } from '../types/portfolio';
import { Link } from 'react-router-dom';

export const PortfolioPage = ({ holdings }: { holdings: Holding[] }) => <section className="page"><h1>Holdings</h1>
  <div className="list">{holdings.map((h)=> <Link to={`/asset/${h.ticker}`} className="card holding" key={h.ticker}>
    <div><strong>{h.ticker}</strong><p>{h.type}</p></div>
    <div><p>{h.allocationPct.toFixed(1)}%</p><p>${h.currentValue.toFixed(2)}</p><p className={h.pnl>=0?'pos':'neg'}>{h.returnPct.toFixed(2)}%</p></div>
  </Link>)}</div>
</section>;
