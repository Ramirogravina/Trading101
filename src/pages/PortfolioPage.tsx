import { Holding } from '../types/portfolio';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const PortfolioPage = ({ holdings, onAddClick }: { holdings: Holding[]; onAddClick: () => void }) => {
  return <section className="page"><h1>Portfolio</h1>
    <div className="section-title"><h2>Todas tus compras</h2><button className="icon-btn" onClick={onAddClick}><Plus size={18} /></button></div>
    <div className="list">{holdings.map((h)=> <Link to={`/asset/${h.ticker}`} className="card holding" key={h.ticker}>
      <div><strong>{h.ticker}</strong><p>{h.type}</p></div>
      <div><p>{h.allocationPct.toFixed(1)}%</p><p>${h.currentValue.toFixed(2)}</p><p className={h.pnl>=0?'pos':'neg'}>{h.returnPct.toFixed(2)}%</p></div>
    </Link>)}</div>
  </section>;
};
