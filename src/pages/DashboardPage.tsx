import { Holding } from '../types/portfolio';

export const DashboardPage = ({ holdings, showUsd, onToggleUsd, mepUsd }: { holdings: Holding[]; showUsd: boolean; onToggleUsd: () => void; mepUsd: number }) => {
  const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const pnl = totalValue - totalInvested;
  const ret = totalInvested ? (pnl / totalInvested) * 100 : 0;
  const fx = showUsd ? mepUsd : 1;
  const symbol = showUsd ? 'USD' : 'ARS';

  return <section className="page"><h1>Home</h1>
    <div className="section-title"><span>Moneda</span><button className={showUsd ? 'switch on' : 'switch'} onClick={onToggleUsd}>{showUsd ? 'USD' : 'ARS'}</button></div>
    <div className="stats-grid">
      <article className="card"><p>Total invertido</p><h2>{symbol} {(totalInvested / fx).toFixed(2)}</h2></article>
      <article className="card"><p>Valor actual</p><h2>{symbol} {(totalValue / fx).toFixed(2)}</h2></article>
      <article className="card"><p>P/L</p><h2 className={pnl>=0?'pos':'neg'}>{symbol} {(pnl / fx).toFixed(2)}</h2></article>
      <article className="card"><p>Retorno (%)</p><h2 className={ret>=0?'pos':'neg'}>{ret.toFixed(2)}%</h2></article>
    </div>
  </section>;
};
