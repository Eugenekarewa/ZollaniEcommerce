import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { getMonthlyFinancials, getCustomerGrowth, getTopServices } from '@/lib/analytics';
import Charts from './Charts';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [financials, customerGrowth, topServices] = await Promise.all([
    getMonthlyFinancials(db, 6),
    getCustomerGrowth(db, 6),
    getTopServices(db, 6),
  ]);

  const totalRevenue = financials.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = financials.reduce((s, m) => s + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const thisMonth = financials[financials.length - 1];
  const lastMonth = financials[financials.length - 2];
  const revenueGrowth = lastMonth && lastMonth.revenue > 0
    ? Math.round(((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Business performance over the last 6 months</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Revenue (6mo)</p>
          <p className="text-2xl font-black text-coral">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Expenses (6mo)</p>
          <p className="text-2xl font-black text-charcoal">{formatPrice(totalExpenses)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Net Profit (6mo)</p>
          <p className={`text-2xl font-black ${totalProfit >= 0 ? 'text-teal' : 'text-red-600'}`}>{formatPrice(totalProfit)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Month-over-Month</p>
          <p className={`text-2xl font-black ${revenueGrowth === null ? 'text-gray-400' : revenueGrowth >= 0 ? 'text-teal' : 'text-red-600'}`}>
            {revenueGrowth === null ? '—' : `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`}
          </p>
        </div>
      </div>

      <Charts financials={financials} customerGrowth={customerGrowth} topServices={topServices} />
    </div>
  );
}
