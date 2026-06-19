'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { ASSET_CATEGORIES } from '@/lib/asset';

const inputClass = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200';
const today = () => new Date().toISOString().slice(0, 10);

type AssetForm = {
  id: string;
  name: string;
  category: string;
  purchaseCost: number;
  purchaseDate: string;
  usefulLifeYears: number;
  salvageValue: number;
  notes: string;
  disposed: boolean;
};

export default function AssetManager({ asset }: { asset: AssetForm }) {
  const router = useRouter();
  const [form, setForm] = useState(asset);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  const [disposing, setDisposing] = useState(false);
  const [disposeDate, setDisposeDate] = useState(today());
  const [disposeValue, setDisposeValue] = useState(0);
  const [disposeError, setDisposeError] = useState('');

  const [deleting, setDeleting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavingEdit(true);
    setEditError('');
    try {
      const res = await fetch(`/api/admin/assets/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          purchaseCost: form.purchaseCost,
          purchaseDate: form.purchaseDate,
          usefulLifeYears: form.usefulLifeYears,
          salvageValue: form.salvageValue,
          notes: form.notes,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to save');
      }
      router.refresh();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDispose(e: React.FormEvent) {
    e.preventDefault();
    setDisposing(true);
    setDisposeError('');
    try {
      const res = await fetch(`/api/admin/assets/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disposed: true, disposedAt: disposeDate, disposalValue: disposeValue }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to dispose asset');
      }
      router.refresh();
    } catch (err) {
      setDisposeError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setDisposing(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Permanently delete "${asset.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/assets/${asset.id}`, { method: 'DELETE' });
      router.push('/admin/assets');
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="card space-y-4">
        <h2 className="font-bold text-charcoal">Edit Asset</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Asset Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
            <select name="category" required value={form.category} onChange={handleChange} className={inputClass}>
              {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Purchase Cost (KES)</label>
            <input name="purchaseCost" type="number" min={0} required value={form.purchaseCost} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Purchase Date</label>
            <input name="purchaseDate" type="date" required value={form.purchaseDate} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Useful Life (years)</label>
            <input name="usefulLifeYears" type="number" min={1} required value={form.usefulLifeYears} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Salvage Value (KES)</label>
            <input name="salvageValue" type="number" min={0} value={form.salvageValue} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Notes</label>
          <input name="notes" value={form.notes} onChange={handleChange} className={inputClass} />
        </div>
        {editError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{editError}</p>}
        <button type="submit" disabled={savingEdit} className="btn-primary disabled:opacity-60">
          {savingEdit ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : 'Save Changes'}
        </button>
      </form>

      {!asset.disposed && (
        <form onSubmit={handleDispose} className="card space-y-4 border-yellow-200 bg-yellow-50/30">
          <h2 className="font-bold text-charcoal">Dispose / Sell Asset</h2>
          <p className="text-sm text-gray-500">Mark this asset as sold, written off, or no longer owned.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Disposal Date</label>
              <input type="date" required value={disposeDate} onChange={(e) => setDisposeDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Proceeds Received (KES)</label>
              <input type="number" min={0} value={disposeValue || ''} onChange={(e) => setDisposeValue(Number(e.target.value))} className={inputClass} />
            </div>
          </div>
          {disposeError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{disposeError}</p>}
          <button type="submit" disabled={disposing} className="btn-ghost text-yellow-700 border-yellow-300 hover:bg-yellow-100 disabled:opacity-60">
            {disposing ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : 'Mark as Disposed'}
          </button>
        </form>
      )}

      <div className="card border-red-100">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" /> Delete Asset Record
        </button>
      </div>
    </div>
  );
}
