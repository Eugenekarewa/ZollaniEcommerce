'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/lib/expense';

const inputClass = 'w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200';
const today = () => new Date().toISOString().slice(0, 10);

export default function AddExpenseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ category: '', description: '', amount: 0, date: today(), vendor: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to add expense');
      }
      setForm({ category: '', description: '', amount: 0, date: today(), vendor: '' });
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
        <Plus className="h-4 w-4" /> Add Expense
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
          <select name="category" required value={form.category} onChange={handleChange} className={inputClass}>
            <option value="">Select…</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Amount (KES)</label>
          <input name="amount" type="number" min={1} required value={form.amount || ''} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
        <input name="description" required value={form.description} onChange={handleChange} className={inputClass} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Date</label>
          <input name="date" type="date" required value={form.date} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Vendor (optional)</label>
          <input name="vendor" value={form.vendor} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : 'Save Expense'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
