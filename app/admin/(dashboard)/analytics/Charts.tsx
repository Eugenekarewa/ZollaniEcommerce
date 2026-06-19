'use client';

import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const CORAL = '#F6917C';
const TEAL = '#4D9190';
const CHARCOAL = '#9CA3AF';

type Financials = { month: string; revenue: number; expenses: number; profit: number };
type CustomerGrowth = { month: string; newCustomers: number; totalCustomers: number };
type TopService = { service: string; revenue: number };

function formatKes(v: number) {
  return `KES ${v.toLocaleString('en-KE')}`;
}

export default function Charts({
  financials,
  customerGrowth,
  topServices,
}: {
  financials: Financials[];
  customerGrowth: CustomerGrowth[];
  topServices: TopService[];
}) {
  return (
    <div className="space-y-6">
      {/* Revenue vs Expenses */}
      <div className="card">
        <h2 className="font-bold text-charcoal mb-4">Revenue vs. Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={financials}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(v) => formatKes(Number(v))} contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill={CORAL} radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill={CHARCOAL} radius={[6, 6, 0, 0]} />
            <Line type="monotone" dataKey="profit" name="Profit" stroke={TEAL} strokeWidth={3} dot={{ fill: TEAL, r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer growth */}
        <div className="card">
          <h2 className="font-bold text-charcoal mb-4">Customer Growth</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={customerGrowth}>
              <defs>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TEAL} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Area type="monotone" dataKey="totalCustomers" name="Total Customers" stroke={TEAL} fill="url(#customerGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top services */}
        <div className="card">
          <h2 className="font-bold text-charcoal mb-4">Top Services by Revenue</h2>
          {topServices.length === 0 ? (
            <p className="text-sm text-gray-400 py-20 text-center">No paid invoices yet in this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topServices} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis type="category" dataKey="service" width={120} tick={{ fontSize: 12, fill: '#374151' }} />
                <Tooltip formatter={(v) => formatKes(Number(v))} contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
                <Bar dataKey="revenue" name="Revenue" fill={CORAL} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
