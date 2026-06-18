'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { INVENTORY_CATEGORIES } from '@/lib/inventory';

const inputClass = 'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200';

export default function NewItemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', sku: '', category: '', quantity: 0, reorderLevel: 5,
    unitCost: 0, unitPrice: 0, supplier: '', notes: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to create item');
      }
      router.push('/admin/inventory');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating item');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Item Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">SKU (optional)</label>
          <input name="sku" value={form.sku} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
        <select name="category" required value={form.category} onChange={handleChange} className={inputClass}>
          <option value="">Select a category…</option>
          {INVENTORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Starting Quantity</label>
          <input name="quantity" type="number" min={0} value={form.quantity} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Low-Stock Alert Level</label>
          <input name="reorderLevel" type="number" min={0} value={form.reorderLevel} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Unit Cost (KES)</label>
          <input name="unitCost" type="number" min={0} value={form.unitCost} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Unit Price (KES)</label>
          <input name="unitPrice" type="number" min={0} value={form.unitPrice} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Supplier (optional)</label>
        <input name="supplier" value={form.supplier} onChange={handleChange} className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : 'Add Item'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
