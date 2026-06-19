import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { isLowStock } from '@/lib/inventory';
import StockActions from './StockActions';

export const dynamic = 'force-dynamic';

export default async function InventoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.inventoryItem.findUnique({
    where: { id },
    include: { movements: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
  if (!item) notFound();

  const low = isLowStock(item);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">{item.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{item.category} {item.sku && `· ${item.sku}`}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Current Stock</p>
          <p className={`text-2xl font-black ${low ? 'text-red-600' : 'text-charcoal'}`}>{item.quantity}</p>
          {low && <p className="text-xs text-red-500 mt-1">Below reorder level ({item.reorderLevel})</p>}
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Unit Cost</p>
          <p className="text-2xl font-black text-charcoal">{item.unitCost ? formatPrice(item.unitCost) : '—'}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Unit Price</p>
          <p className="text-2xl font-black text-coral">{item.unitPrice ? formatPrice(item.unitPrice) : '—'}</p>
        </div>
      </div>

      <StockActions itemId={item.id} currentQuantity={item.quantity} />

      <div className="card">
        <h2 className="font-bold text-charcoal mb-4">Movement History</h2>
        {item.movements.length === 0 ? (
          <p className="text-sm text-gray-400">No movements recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {item.movements.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-t border-gray-100 pt-2 first:border-t-0 first:pt-0 text-sm">
                <div>
                  <span className={`font-semibold ${m.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {m.quantity > 0 ? '+' : ''}{m.quantity}
                  </span>
                  <span className="text-gray-500 ml-2 capitalize">{m.type}</span>
                  {m.note && <span className="text-gray-400 ml-2">— {m.note}</span>}
                </div>
                <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString('en-KE')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
