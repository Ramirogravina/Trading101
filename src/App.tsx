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
import { Transaction } from './types/portfolio';
import { calculateHoldingsWithPrices } from './utils/portfolio';

export const App = () => {
  const { transactions, setTransactions } = useLocalTransactions();
  const { getLivePrice, mepUsd } = useMarketData(transactions);
  const livePriceMap = useMemo(() => Object.fromEntries(transactions.map((t) => [t.ticker, getLivePrice(t.ticker, 0)])), [transactions, getLivePrice]);
  const holdings = useMemo(() => calculateHoldingsWithPrices(transactions, livePriceMap), [transactions, livePriceMap]);
  const [open, setOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [showUsd, setShowUsd] = useState(false);

  return <>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage holdings={holdings} showUsd={showUsd} onToggleUsd={() => setShowUsd((v) => !v)} mepUsd={mepUsd} />} />
        <Route path="/portfolio" element={<PortfolioPage holdings={holdings} transactions={transactions} onAddClick={() => { setEditingTx(null); setOpen(true); }} onEdit={(tx) => { setEditingTx(tx); setOpen(true); }} onDuplicate={(tx) => setTransactions([...transactions, { ...tx, id: crypto.randomUUID() }])} onDelete={(id) => setTransactions(transactions.filter((t) => t.id !== id))} />} />
        <Route path="/asset/:ticker" element={<AssetDetailPage holdings={holdings} />} />
        <Route path="/analytics" element={<AnalyticsPage holdings={holdings} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    <button className="fab" onClick={() => { setEditingTx(null); setOpen(true); }}><Plus size={22} /></button>
    <AddTransactionModal open={open} initialTx={editingTx} onClose={() => setOpen(false)} onAdd={(tx) => setTransactions((prev) => prev.some((p) => p.id === tx.id) ? prev.map((p) => p.id === tx.id ? tx : p) : [...prev, tx])} />
  </>;
};
