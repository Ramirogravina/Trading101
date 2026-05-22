import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppLayout } from './layouts/AppLayout';
import { useLocalTransactions } from './hooks/useLocalTransactions';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { AddTransactionModal } from './components/AddTransactionModal';
import { useMarketData } from './hooks/useMarketData';
import { Transaction, WatchlistItem } from './types/portfolio';
import { calculateHoldingsWithPrices } from './utils/portfolio';

export const App = () => {
  const { transactions, setTransactions } = useLocalTransactions();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const raw = localStorage.getItem('trading101_watchlist_v1');
    return raw ? JSON.parse(raw) : [];
  });
  const { getLivePrice, mepUsd, dayChangePct } = useMarketData(transactions, watchlist.map((w) => w.symbol));
  const livePriceMap = useMemo(() => Object.fromEntries(transactions.map((t) => [t.ticker, getLivePrice(t.ticker, 0)])), [transactions, getLivePrice]);
  const holdings = useMemo(() => calculateHoldingsWithPrices(transactions, livePriceMap), [transactions, livePriceMap]);
  const [open, setOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [showUsd, setShowUsd] = useState(false);
  const setWatchlistPersist = (next: WatchlistItem[]) => {
    setWatchlist(next);
    localStorage.setItem('trading101_watchlist_v1', JSON.stringify(next));
  };

  return <>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage holdings={holdings} showUsd={showUsd} onToggleUsd={() => setShowUsd((v) => !v)} mepUsd={mepUsd} />} />
        <Route path="/portfolio" element={<PortfolioPage holdings={holdings} transactions={transactions} onAddClick={() => { setEditingTx(null); setOpen(true); }} onEdit={(tx) => { setEditingTx(tx); setOpen(true); }} onDuplicate={(tx) => setTransactions([...transactions, { ...tx, id: crypto.randomUUID() }])} onDelete={(id) => setTransactions(transactions.filter((t) => t.id !== id))} />} />
        <Route path="/asset/:ticker" element={<AssetDetailPage holdings={holdings} />} />
        <Route path="/analytics" element={<AnalyticsPage watchlist={watchlist} onAddWatch={(w) => setWatchlistPersist(watchlist.some((x) => x.symbol === w.symbol) ? watchlist : [...watchlist, w])} onDeleteWatch={(symbol) => setWatchlistPersist(watchlist.filter((w) => w.symbol !== symbol))} getLivePrice={getLivePrice} dayChangePct={dayChangePct} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    <button className="fab" onClick={() => { setEditingTx(null); setOpen(true); }}><Plus size={22} /></button>
    <AddTransactionModal open={open} initialTx={editingTx} onClose={() => setOpen(false)} onAdd={(tx) => setTransactions((prev) => prev.some((p) => p.id === tx.id) ? prev.map((p) => p.id === tx.id ? tx : p) : [...prev, tx])} />
  </>;
};
