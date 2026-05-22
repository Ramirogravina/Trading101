import { Holding } from '../types/portfolio';
import { AllocationChart } from '../components/AllocationChart';

type Props = {
  holdings: Holding[];
  mepUsd: number;
  displayCurrency: 'ARS' | 'USD';
  onToggleCurrency: (c: 'ARS' | 'USD') => void;
};

export const DashboardPage = ({ holdings, mepUsd, displayCurrency, onToggleCurrency }: Props) => {
  const totalInvestedArs = holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalValueArs = holdings.reduce((s, h) => s + h.currentValue, 0);
  const pnlArs = totalValueArs - totalInvestedArs;

  const fx = displayCurrency === 'USD' ? mepUsd : 1;
  const sym = displayCurrency === 'USD' ? 'US$' : '$';
  const totalInvested = totalInvestedArs / fx;
  const totalValue = totalValueArs / fx;
  const pnl = pnlArs / fx;
  const ret = totalInvestedArs ? (pnlArs / totalInvestedArs) * 100 : 0;

  return <section className="page"><div className="dashboard-head"><h1>Portfolio Dashboard</h1>
    <div className="switch-wrap"><small>Moneda ({displayCurrency}) · MEP {mepUsd.toFixed(2)}</small><div className="switch">
      <button className={displayCurrency==='ARS'?'active':''} onClick={() => onToggleCurrency('ARS')}>ARS</button>
      <button className={displayCurrency==='USD'?'active':''} onClick={() => onToggleCurrency('USD')}>USD</button>
    </div></div></div>
    <div className="stats-grid">
      <article className="card"><p>Total invested</p><h2>{sym}{totalInvested.toFixed(2)}</h2></article>
      <article className="card"><p>Current value</p><h2>{sym}{totalValue.toFixed(2)}</h2></article>
      <article className="card"><p>P/L</p><h2 className={pnl>=0?'pos':'neg'}>{sym}{pnl.toFixed(2)}</h2></article>
      <article className="card"><p>Return</p><h2 className={ret>=0?'pos':'neg'}>{ret.toFixed(2)}%</h2></article>
    </div>
    <AllocationChart data={holdings} />
  </section>;
};
