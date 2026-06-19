'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { ASSET_CATEGORIES } from '@/lib/asset';

const inputClass = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200';
const today = () => new Date().toISOString().slice(0, 10);

export default function AddAssetForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', category: '', purchaseCost: 0, purchaseDate: today(),
    usefulLifeYears: 3, salvageValue: 0, notes: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to add asset');
      }
      setForm({ name: '', category: '', purchaseCost: 0, purchaseDate: today(), usefulLifeYears: 3, salvageValue: 0, notes: '' });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Plus className="h-4 w-4" /> Add Asset
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Asset Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="e.g. Toyota Probox, Soldering Station" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
          <select name="category" required value={form.category} onChange={handleChange} className={inputClass}>
            <option value="">Select…</option>
            {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Purchase Cost (KES)</label>
          <input name="purchaseCost" type="number" min={0} required value={form.purchaseCost || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Purchase Date</label>
          <input name="purchaseDate" type="date" required value={form.purchaseDate} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Useful Life (years)</label>
          <input name="usefulLifeYears" type="number" min={1} required value={form.usefulLifeYears || ''} onChange={handleChange} className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">How many years before it's fully written off</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Salvage Value (KES)</label>
          <input name="salvageValue" type="number" min={0} value={form.salvageValue || ''} onChange={handleChange} className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Estimated resale value at end of life (default 0)</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Notes (optional)</label>
        <input name="notes" value={form.notes} onChange={handleChange} className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : 'Save Asset'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
