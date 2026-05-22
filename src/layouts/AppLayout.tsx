import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Home, PieChart } from 'lucide-react';

export const AppLayout = () => (
  <div className="app-shell">
    <main><Outlet /></main>
    <nav className="bottom-nav">
      <NavLink to="/"><Home size={18}/>Home</NavLink>
      <NavLink to="/portfolio"><PieChart size={18}/>Portfolio</NavLink>
      <NavLink to="/analytics"><BarChart3 size={18}/>Analytics</NavLink>
    </nav>
  </div>
);
