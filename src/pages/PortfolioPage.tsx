import { Holding, Transaction } from '../types/portfolio';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const PortfolioPage = ({ holdings, transactions, onAddClick, onEdit, onDuplicate, onDelete }: {
  holdings: Holding[];
  transactions: Transaction[];
  onAddClick: () => void;
  onEdit: (tx: Transaction) => void;
  onDuplicate: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) => {
  return <section className="page"><h1>Portfolio</h1>
    <div className="section-title"><h2>Todas tus compras</h2><button className="icon-btn" onClick={onAddClick}><Plus size={18} /></button></div>
    <div className="list">{holdings.map((h)=> <Link to={`/asset/${h.ticker}`} className="card holding" key={h.ticker}>
      <div><strong>{h.ticker}</strong><p>{h.type}</p></div>
      <div><p>{h.allocationPct.toFixed(1)}%</p><p>${h.currentValue.toFixed(2)}</p><p className={h.pnl>=0?'pos':'neg'}>{h.returnPct.toFixed(2)}%</p></div>
    </Link>)}</div>
    <h2>Transacciones</h2>
    <div className="list">{transactions.map((tx) => <article className="card" key={tx.id}>
      <div className="tx-row"><div><strong>{tx.ticker}</strong><p>{tx.purchaseDate} · {tx.currency}</p></div><p>{tx.currency} {tx.investedAmount.toFixed(2)}</p></div>
      <div className="tx-actions">
        <button onClick={() => onEdit(tx)}>Edit</button>
        <button onClick={() => onDuplicate(tx)}>Duplicate</button>
        <button onClick={() => onDelete(tx.id)}>Delete</button>
      </div>
    </article>)}</div>
  </section>;
};
