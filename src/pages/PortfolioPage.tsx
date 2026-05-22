import { Holding } from '../types/portfolio';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { mockAssets } from '../data/mockAssets';

type Tab = 'portfolio' | 'holdings' | 'market';

export const PortfolioPage = ({ holdings, onAddClick }: { holdings: Holding[]; onAddClick: () => void }) => {
  const [tab, setTab] = useState<Tab>('portfolio');
  const totals = useMemo(() => {
    const totalInvested = holdings.reduce((s, h) => s + h.investedAmount, 0);
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const pnl = totalValue - totalInvested;
    const ret = totalInvested ? (pnl / totalInvested) * 100 : 0;
    return { totalInvested, totalValue, pnl, ret };
  }, [holdings]);

  return <section className="page"><h1>Portfolio</h1>
    <div className="tabs">
      <button className={tab === 'portfolio' ? 'tab active' : 'tab'} onClick={() => setTab('portfolio')}>Portfolio</button>
      <button className={tab === 'holdings' ? 'tab active' : 'tab'} onClick={() => setTab('holdings')}>Holdings</button>
      <button className={tab === 'market' ? 'tab active' : 'tab'} onClick={() => setTab('market')}>Market</button>
    </div>

    {tab === 'portfolio' && <div className="stats-grid">
      <article className="card"><p>Total invertido</p><h2>${totals.totalInvested.toFixed(2)}</h2></article>
      <article className="card"><p>Valor actual</p><h2>${totals.totalValue.toFixed(2)}</h2></article>
      <article className="card"><p>P/L</p><h2 className={totals.pnl >= 0 ? 'pos' : 'neg'}>${totals.pnl.toFixed(2)}</h2></article>
      <article className="card"><p>Retorno (%)</p><h2 className={totals.ret >= 0 ? 'pos' : 'neg'}>{totals.ret.toFixed(2)}%</h2></article>
    </div>}

    {tab === 'holdings' && <>
      <div className="section-title"><h2>Todas tus compras</h2><button className="icon-btn" onClick={onAddClick}><Plus size={18} /></button></div>
      <div className="list">{holdings.map((h)=> <Link to={`/asset/${h.ticker}`} className="card holding" key={h.ticker}>
        <div><strong>{h.ticker}</strong><p>{h.type}</p></div>
        <div><p>{h.allocationPct.toFixed(1)}%</p><p>${h.currentValue.toFixed(2)}</p><p className={h.pnl>=0?'pos':'neg'}>{h.returnPct.toFixed(2)}%</p></div>
      </Link>)}</div>
    </>}

    {tab === 'market' && <div className="list">{mockAssets.map((asset) => <article className="card holding" key={asset.ticker}>
      <div><strong>{asset.ticker}</strong><p>{asset.type}</p></div>
      <div><p>{asset.name}</p><p>{asset.currency} {asset.currentPrice.toFixed(2)}</p></div>
    </article>)}</div>}
  </section>;
};
