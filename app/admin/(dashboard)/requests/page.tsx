import Link from 'next/link';
import { db } from '@/lib/db';
import RequestStatusSelect from './RequestStatusSelect';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
  const requests = await db.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      invoices: { select: { id: true, invoiceNumber: true, status: true } },
      customer: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-charcoal">Service Requests ({requests.length})</h1>

      {requests.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">No service requests yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  {req.customer ? (
                    <Link href={`/admin/customers/${req.customer.id}`} className="font-bold text-charcoal hover:text-coral hover:underline">
                      {req.name}
                    </Link>
                  ) : (
                    <p className="font-bold text-charcoal">{req.name}</p>
                  )}
                  <p className="text-sm text-gray-500">{req.email} {req.phone ? `· ${req.phone}` : ''}</p>
                  <p className="text-sm text-coral font-medium mt-1">{req.service}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RequestStatusSelect requestId={req.id} current={req.status} />
                </div>
              </div>

              <p className="text-sm text-gray-600 border-t pt-3">{req.message}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString('en-KE')}</p>
                <div className="flex items-center gap-3">
                  {req.invoices.map((inv) => (
                    <Link key={inv.id} href={`/admin/invoices`} className="text-xs font-medium text-teal hover:underline">
                      {inv.invoiceNumber} ({inv.status})
                    </Link>
                  ))}
                  <Link
                    href={`/admin/requests/${req.id}/invoice`}
                    className="text-xs font-semibold text-white bg-coral rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity"
                  >
                    + Create Invoice
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
