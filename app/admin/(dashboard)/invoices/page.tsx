import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import InvoiceStatusSelect from './InvoiceStatusSelect';

export const dynamic = 'force-dynamic';

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
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
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
                  <td className="px-4 py-3">
                    <InvoiceStatusSelect invoiceId={inv.id} current={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString('en-KE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
