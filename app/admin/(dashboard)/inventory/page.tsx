import Link from 'next/link';
import { Plus, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { isLowStock } from '@/lib/inventory';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const items = await db.inventoryItem.findMany({ orderBy: { name: 'asc' } });
  const lowStockCount = items.filter(isLowStock).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-charcoal">Inventory ({items.length})</h1>
          {lowStockCount > 0 && (
            <p className="text-sm text-coral font-medium mt-1 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} low on stock
            </p>
          )}
        </div>
        <Link href="/admin/inventory/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          No inventory items yet. Add repair parts and components to start tracking stock.
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Unit Cost</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => {
                  const low = isLowStock(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/inventory/${item.id}`} className="font-medium text-coral hover:underline">
                          {item.name}
                        </Link>
                        {item.sku && <p className="text-xs text-gray-400">{item.sku}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold rounded-full px-2.5 py-0.5 text-xs ${low ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {item.quantity} {low && '(low)'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.unitCost ? formatPrice(item.unitCost) : '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{item.unitPrice ? formatPrice(item.unitPrice) : '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{item.supplier ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
