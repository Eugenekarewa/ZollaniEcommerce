import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import AddExpenseForm from './AddExpenseForm';
import DeleteExpenseButton from './DeleteExpenseButton';

export const dynamic = 'force-dynamic';

export default async function AdminExpensesPage() {
  const expenses = await db.expense.findMany({ orderBy: { date: 'desc' } });

  const now = new Date();
  const thisMonthTotal = expenses
    .filter((e) => e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear())
    .reduce((s, e) => s + e.amount, 0);
  const allTimeTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-charcoal">Expenses</h1>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="card">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-black text-coral">{formatPrice(thisMonthTotal)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">All Time</p>
          <p className="text-2xl font-black text-charcoal">{formatPrice(allTimeTotal)}</p>
        </div>
      </div>

      <AddExpenseForm />

      {expenses.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">No expenses recorded yet.</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500">{e.date.toLocaleDateString('en-KE')}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs text-teal">{e.category}</span>
                    </td>
                    <td className="px-4 py-3 text-charcoal">{e.description}</td>
                    <td className="px-4 py-3 text-gray-500">{e.vendor ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-coral">{formatPrice(e.amount)}</td>
                    <td className="px-4 py-3"><DeleteExpenseButton id={e.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
