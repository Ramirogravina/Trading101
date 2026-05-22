import { Holding } from '../types/portfolio';
import { AllocationChart } from '../components/AllocationChart';

export const DashboardPage = ({ holdings }: { holdings: Holding[] }) => {
  const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const pnl = totalValue - totalInvested;
  const ret = totalInvested ? (pnl / totalInvested) * 100 : 0;

  return <section className="page"><h1>Portfolio Dashboard</h1>
    <div className="stats-grid">
      <article className="card"><p>Total invested</p><h2>${totalInvested.toFixed(2)}</h2></article>
      <article className="card"><p>Current value</p><h2>${totalValue.toFixed(2)}</h2></article>
      <article className="card"><p>P/L</p><h2 className={pnl>=0?'pos':'neg'}>${pnl.toFixed(2)}</h2></article>
      <article className="card"><p>Return</p><h2 className={ret>=0?'pos':'neg'}>{ret.toFixed(2)}%</h2></article>
    </div>
    <AllocationChart data={holdings} />
  </section>;
};
