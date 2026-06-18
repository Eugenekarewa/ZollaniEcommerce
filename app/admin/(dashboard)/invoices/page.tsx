import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import InvoiceStatusSelect from './InvoiceStatusSelect';

export const dynamic = 'force-dynamic';

const REMINDER_LABELS: Record<number, string> = {
  0: '—',
  1: 'Due-soon sent',
  2: 'Overdue sent',
  3: 'Final notice sent',
};

export default async function AdminInvoicesPage() {
  const invoices = await db.invoice.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-charcoal">Invoices ({invoices.length})</h1>

      {invoices.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          No invoices yet. Create one from a service request.
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Due / Paid</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Reminders</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const isOverdue = inv.status === 'sent' && inv.dueDate && inv.dueDate.getTime() < Date.now();
                return (
                  <tr key={inv.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      <a href={`/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">
                        {inv.invoiceNumber}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{inv.clientName}</p>
                      <p className="text-xs text-gray-400">{inv.clientEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{inv.service}</td>
                    <td className="px-4 py-3 font-medium text-coral">{formatPrice(inv.amount)}</td>
                    <td className="px-4 py-3 text-xs">
                      {inv.status === 'paid' && inv.paidAt ? (
                        <span className="text-green-700">Paid {inv.paidAt.toLocaleDateString('en-KE')}</span>
                      ) : inv.dueDate ? (
                        <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                          {inv.dueDate.toLocaleDateString('en-KE')}{isOverdue ? ' (overdue)' : ''}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{inv.paymentMethod ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{REMINDER_LABELS[inv.reminderStage]}</td>
                    <td className="px-4 py-3">
                      <InvoiceStatusSelect invoiceId={inv.id} current={inv.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
