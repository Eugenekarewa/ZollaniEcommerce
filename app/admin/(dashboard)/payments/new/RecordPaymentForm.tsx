'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const inputClass = 'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200';
const today = () => new Date().toISOString().slice(0, 10);

const PAYMENT_METHODS = [
  { value: 'cash',     label: 'Cash' },
  { value: 'mpesa',    label: 'M-Pesa (manual)' },
  { value: 'bank',     label: 'Bank Transfer' },
  { value: 'paystack', label: 'Paystack (recorded manually)' },
  { value: 'other',    label: 'Other' },
];

export default function RecordPaymentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    service: '', description: '', amount: 0,
    paidAt: today(), paymentMethod: 'cash',
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
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to record payment');
      }
      router.push('/admin/invoices');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error recording payment');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Name</label>
          <input name="clientName" required value={form.clientName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Email</label>
          <input name="clientEmail" type="email" required value={form.clientEmail} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Client Phone</label>
        <input name="clientPhone" value={form.clientPhone} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Service</label>
        <input name="service" required value={form.service} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
        <textarea name="description" required rows={2} value={form.description} onChange={handleChange} className={`${inputClass} resize-none`} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Amount (KES)</label>
          <input name="amount" type="number" min={1} required value={form.amount || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Date Paid</label>
          <input name="paidAt" type="date" required value={form.paidAt} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Method</label>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputClass}>
            {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Recording…</> : 'Record Payment'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
