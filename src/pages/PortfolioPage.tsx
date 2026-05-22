import { Holding, Transaction } from '../types/portfolio';
import { Link } from 'react-router-dom';
import { Pencil, Copy, Trash2 } from 'lucide-react';

type Props = {
  holdings: Holding[];
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export const PortfolioPage = ({ holdings, transactions, onEdit, onDuplicate, onDelete }: Props) => <section className="page"><h1>Holdings</h1>
  <div className="list">{holdings.map((h)=> <Link to={`/asset/${h.ticker}`} className="card holding" key={h.ticker}>
    <div><strong>{h.ticker}</strong><p>{h.type}</p></div>
    <div><p>{h.allocationPct.toFixed(1)}%</p><p>${h.currentValue.toFixed(2)}</p><p className={h.pnl>=0?'pos':'neg'}>{h.returnPct.toFixed(2)}%</p></div>
  </Link>)}</div>

  <h2>Transactions</h2>
  <div className="list">
    {transactions.map((tx) => <article className="card tx" key={tx.id}>
      <div><strong>{tx.ticker}</strong><p>{tx.investedAmount.toFixed(2)} {tx.investedCurrency}</p></div>
      <div className="tx-actions">
        <button type="button" onClick={() => onEdit(tx)}><Pencil size={14} /></button>
        <button type="button" onClick={() => onDuplicate(tx.id)}><Copy size={14} /></button>
        <button type="button" onClick={() => onDelete(tx.id)}><Trash2 size={14} /></button>
      </div>
    </article>)}
  </div>
</section>;
