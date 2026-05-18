import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppLayout } from './layouts/AppLayout';
import { useLocalTransactions } from './hooks/useLocalTransactions';
import { calculateHoldings } from './utils/portfolio';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { AddTransactionModal } from './components/AddTransactionModal';

export const App = () => {
  const { transactions, setTransactions } = useLocalTransactions();
  const holdings = useMemo(() => calculateHoldings(transactions), [transactions]);
  const [open, setOpen] = useState(false);

  return <>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage holdings={holdings} />} />
        <Route path="/portfolio" element={<PortfolioPage holdings={holdings} />} />
        <Route path="/asset/:ticker" element={<AssetDetailPage holdings={holdings} />} />
        <Route path="/analytics" element={<AnalyticsPage holdings={holdings} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    <button className="fab" onClick={() => setOpen(true)}><Plus size={22} /></button>
    <AddTransactionModal open={open} onClose={() => setOpen(false)} onAdd={(tx) => setTransactions([...transactions, tx])} />
  </>;
};
