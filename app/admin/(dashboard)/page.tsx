import Link from 'next/link';
import { Inbox, DollarSign, Users, AlertTriangle, Package, BarChart3 } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, INVOICE_STATUSES } from '@/lib/invoice';
import { isLowStock } from '@/lib/inventory';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [customerCount, newRequests, overdueCount, recentInvoices, paidRevenue, partialRevenue, inventoryItems] = await Promise.all([
    db.customer.count(),
    db.contactSubmission.count({ where: { status: 'new' } }),
    db.invoice.count({ where: { status: 'sent', dueDate: { lt: new Date() } } }),
    db.invoice.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    db.invoice.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
    db.invoice.aggregate({ _sum: { amountPaid: true }, where: { status: 'partial' } }),
    db.inventoryItem.findMany({ select: { name: true, quantity: true, reorderLevel: true } }),
  ]);

  const lowStockItems = inventoryItems.filter(isLowStock);
  const revenueCollected = (paidRevenue._sum.amount ?? 0) + (partialRevenue._sum.amountPaid ?? 0);

  const stats = [
    { icon: <Users className="h-6 w-6 text-coral" />, label: 'Customers', value: customerCount, href: '/admin/customers' },
    { icon: <Inbox className="h-6 w-6 text-coral" />, label: 'New Requests', value: newRequests, href: '/admin/requests' },
    { icon: <AlertTriangle className="h-6 w-6 text-coral" />, label: 'Overdue Invoices', value: overdueCount, href: '/admin/invoices' },
    { icon: <DollarSign className="h-6 w-6 text-teal" />, label: 'Revenue Collected', value: formatPrice(revenueCollected), href: '/admin/invoices' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-charcoal">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Service requests, invoicing & business overview</p>
        </div>
        <Link href="/admin/analytics" className="btn-ghost text-sm">
          <BarChart3 className="h-4 w-4" /> View Analytics
        </Link>
      </div>

      {lowStockItems.length > 0 && (
        <Link
          href="/admin/inventory"
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm hover:border-red-300 transition-colors"
        >
          <Package className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-red-700">
            <strong>{lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} low on stock:</strong>{' '}
            {lowStockItems.slice(0, 3).map((i) => i.name).join(', ')}
            {lowStockItems.length > 3 && ` +${lowStockItems.length - 3} more`}
          </p>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card hover:border-coral transition-all">
            <div className="flex items-center gap-3 mb-2">{s.icon} <span className="text-sm text-gray-500">{s.label}</span></div>
            <p className="text-2xl font-black text-charcoal">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-charcoal">Recent Invoices</h2>
          <Link href="/admin/invoices" className="text-sm text-coral hover:underline">View All</Link>
        </div>
        {recentInvoices.length === 0 ? (
          <p className="text-gray-400 text-sm">No invoices yet. Create one from a service request.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                  <th className="pb-2 pr-4">Invoice</th>
                  <th className="pb-2 pr-4">Client</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{inv.invoiceNumber}</td>
                    <td className="py-2.5 pr-4 text-charcoal">{inv.clientName}</td>
                    <td className="py-2.5 pr-4 font-medium text-coral">{formatPrice(inv.amount)}</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${INVOICE_STATUSES[inv.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
