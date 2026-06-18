'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader2 } from 'lucide-react';

export default function StockActions({ itemId, currentQuantity }: { itemId: string; currentQuantity: number }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleMove(type: 'restock' | 'used') {
    if (qty < 1) return;
    setLoading(true);
    setError('');
    const res = await fetch(`/api/admin/inventory/${itemId}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, quantity: type === 'restock' ? qty : -qty, note: note || undefined }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? 'Failed to update stock');
      setLoading(false);
      return;
    }
    setQty(1);
    setNote('');
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="card space-y-3">
      <h2 className="font-bold text-charcoal">Update Stock</h2>
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Used on invoice ZT-2026-0001"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200"
          />
        </div>
        <button onClick={() => handleMove('restock')} disabled={loading} className="btn-secondary py-2 disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Restock
        </button>
        <button
          onClick={() => handleMove('used')}
          disabled={loading || qty > currentQuantity}
          className="btn-primary py-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />} Use
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
