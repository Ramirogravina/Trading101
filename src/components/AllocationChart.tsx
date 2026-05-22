import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Holding } from '../types/portfolio';

const colors = ['#59f', '#74d3ae', '#f7b955', '#f78389', '#c88dff'];

export const AllocationChart = ({ data }: { data: Holding[] }) => (
  <div className="card chart-card">
    <h3>Allocation</h3>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="currentValue" nameKey="ticker" outerRadius={80}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
