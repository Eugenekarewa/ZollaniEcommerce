import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Building2 } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, INVOICE_STATUSES } from '@/lib/invoice';
import CustomerNotesForm from './CustomerNotesForm';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      submissions: { orderBy: { createdAt: 'desc' } },
      invoices: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!customer) notFound();

  const totalPaid = customer.invoices.reduce((s, i) => s + (i.status === 'paid' ? i.amount : i.status === 'partial' ? i.amountPaid : 0), 0);
  const totalOutstanding = customer.invoices.reduce((s, i) => {
    if (i.status === 'sent') return s + i.amount;
    if (i.status === 'partial') return s + (i.amount - i.amountPaid);
    return s;
  }, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">{customer.name}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-coral" /> {customer.email}</span>
          {customer.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-coral" /> {customer.phone}</span>}
          {customer.company && <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-coral" /> {customer.company}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-black text-teal">{formatPrice(totalPaid)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-black text-coral">{formatPrice(totalOutstanding)}</p>
        </div>
      </div>

      <CustomerNotesForm customer={{ id: customer.id, notes: customer.notes ?? '', tags: customer.tags }} />

      <div className="card">
        <h2 className="font-bold text-charcoal mb-4">Service Requests ({customer.submissions.length})</h2>
        {customer.submissions.length === 0 ? (
          <p className="text-sm text-gray-400">No service requests yet.</p>
        ) : (
          <div className="space-y-3">
            {customer.submissions.map((s) => (
              <div key={s.id} className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal">{s.service}</p>
                  <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString('en-KE')}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{s.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-bold text-charcoal mb-4">Invoices ({customer.invoices.length})</h2>
        {customer.invoices.length === 0 ? (
          <p className="text-sm text-gray-400">No invoices yet.</p>
        ) : (
          <div className="space-y-3">
            {customer.invoices.map((inv) => (
              <Link
                key={inv.id}
                href={`/invoice/${inv.id}`}
                target="_blank"
                className="flex items-center justify-between border-t border-gray-100 pt-3 first:border-t-0 first:pt-0 hover:text-coral transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal">{inv.invoiceNumber} — {inv.service}</p>
                  <p className="text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString('en-KE')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-coral">{formatPrice(inv.amount)}</p>
                  <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${INVOICE_STATUSES[inv.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>
                    {inv.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
