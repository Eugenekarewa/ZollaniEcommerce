import Link from 'next/link';
import { Plus, Upload } from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { submissions: true, invoices: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-charcoal">Customers ({customers.length})</h1>
        <div className="flex gap-2">
          <Link href="/admin/customers/import" className="btn-ghost">
            <Upload className="h-4 w-4" /> Import from Excel
          </Link>
          <Link href="/admin/customers/new" className="btn-primary">
            <Plus className="h-4 w-4" /> Add Customer
          </Link>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          No customers yet. They&apos;re created automatically when someone submits the contact form or gets invoiced.
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Requests</th>
                  <th className="px-4 py-3">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/customers/${c.id}`} className="font-medium text-coral hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <p>{c.email}</p>
                      {c.phone && <p className="text-xs text-gray-400">{c.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.company ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c._count.submissions}</td>
                    <td className="px-4 py-3 text-gray-500">{c._count.invoices}</td>
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
