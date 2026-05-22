import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppLayout } from './layouts/AppLayout';
import { calculateHoldings } from './utils/portfolio';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Transaction } from './types/portfolio';
import { fetchLiveQuotes, fetchMepUsd } from './utils/market';

const PUBLIC_SEED_TRANSACTIONS: Transaction[] = [
  { id: 'seed-1', ticker: 'SPY', type: 'ETF', investedAmount: 1000000, investedCurrency: 'ARS', purchaseDate: '2026-01-10', purchasePrice: 500, purchaseCurrency: 'USD' },
  { id: 'seed-2', ticker: 'AAPL', type: 'Acción USA', investedAmount: 1200, investedCurrency: 'USD', purchaseDate: '2026-02-18', purchasePrice: 190, purchaseCurrency: 'USD' },
  { id: 'seed-3', ticker: 'AL30', type: 'Bono', investedAmount: 800000, investedCurrency: 'ARS', purchaseDate: '2026-03-04', purchasePrice: 49000, purchaseCurrency: 'ARS' },
];

export const App = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(PUBLIC_SEED_TRANSACTIONS);
  const [open, setOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [quotes, setQuotes] = useState<Record<string, number>>({});
  const [mepUsd, setMepUsd] = useState(1200);
  const [displayCurrency, setDisplayCurrency] = useState<'ARS' | 'USD'>('ARS');

  useEffect(() => {
    const refresh = async () => {
      try { setMepUsd(await fetchMepUsd()); } catch {}
      try {
        const tickers = Array.from(new Set(transactions.map((t) => t.ticker.toUpperCase())));
        if (tickers.length > 0) setQuotes(await fetchLiveQuotes(tickers));
      } catch {}
    };
    refresh();
    const id = window.setInterval(refresh, 60000);
    return () => window.clearInterval(id);
  }, [transactions]);

  const holdings = useMemo(() => calculateHoldings(transactions, quotes, mepUsd), [transactions, quotes, mepUsd]);

  const upsertTx = (tx: Transaction) => {
    setTransactions((prev) => {
      const idx = prev.findIndex((it) => it.id === tx.id);
      if (idx < 0) return [...prev, tx];
      const next = [...prev];
      next[idx] = tx;
      return next;
    });
  };

  return <>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage holdings={holdings} mepUsd={mepUsd} displayCurrency={displayCurrency} onToggleCurrency={setDisplayCurrency} />} />
        <Route path="/portfolio" element={<PortfolioPage holdings={holdings} transactions={transactions} onEdit={(tx) => { setEditingTx(tx); setOpen(true); }} onDelete={(id) => setTransactions((prev) => prev.filter((t) => t.id !== id))} onDuplicate={(id) => setTransactions((prev) => { const tx = prev.find((t) => t.id === id); return tx ? [...prev, { ...tx, id: crypto.randomUUID() }] : prev; })} />} />
        <Route path="/asset/:ticker" element={<AssetDetailPage holdings={holdings} />} />
        <Route path="/analytics" element={<AnalyticsPage holdings={holdings} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    <button className="fab" onClick={() => { setEditingTx(null); setOpen(true); }}><Plus size={22} /></button>
    <AddTransactionModal open={open} onClose={() => setOpen(false)} onSave={upsertTx} initial={editingTx} />
  </>;
};
