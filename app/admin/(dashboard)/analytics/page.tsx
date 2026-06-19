import Link from 'next/link';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { getMonthlyFinancials, getCustomerGrowth, getTopServices } from '@/lib/analytics';
import Charts from './Charts';

export const dynamic = 'force-dynamic';

const RANGE_OPTIONS = [3, 6, 12, 24, 36];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const monthsBack = RANGE_OPTIONS.includes(Number(range)) ? Number(range) : 12;

  const [financials, customerGrowth, topServices] = await Promise.all([
    getMonthlyFinancials(db, monthsBack),
    getCustomerGrowth(db, monthsBack),
    getTopServices(db, monthsBack),
  ]);

  const totalRevenue = financials.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = financials.reduce((s, m) => s + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const thisMonth = financials[financials.length - 1];
  const lastMonth = financials[financials.length - 2];
  const revenueGrowth = lastMonth && lastMonth.revenue > 0
    ? Math.round(((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100)
    : null;

  const rangeLabel = monthsBack >= 12 ? `${monthsBack / 12} year${monthsBack > 12 ? 's' : ''}` : `${monthsBack} months`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-charcoal">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Business performance over the last {rangeLabel}</p>
        </div>
        <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1">
          {RANGE_OPTIONS.map((opt) => (
            <Link
              key={opt}
              href={`/admin/analytics?range=${opt}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                monthsBack === opt ? 'bg-white text-coral shadow-sm' : 'text-gray-500 hover:text-charcoal'
              }`}
            >
              {opt >= 12 ? `${opt / 12}y` : `${opt}mo`}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Revenue ({rangeLabel})</p>
          <p className="text-2xl font-black text-coral">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Expenses ({rangeLabel})</p>
          <p className="text-2xl font-black text-charcoal">{formatPrice(totalExpenses)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Net Profit ({rangeLabel})</p>
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
