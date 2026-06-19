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

const STATUS_OPTIONS = [
  { value: 'paid',      label: 'Paid in Full' },
  { value: 'partial',   label: 'Partially Paid' },
  { value: 'unpaid',    label: 'Unpaid / Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function RecordPaymentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    service: '', description: '', amount: 0, expense: 0,
    status: 'paid', amountPaid: 0,
    date: today(), servedBy: '', paymentMethod: 'cash',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientEmail && !form.clientPhone) {
      setError('Provide at least an email or a phone number for the client.');
      return;
    }
    if (form.status === 'partial' && (!form.amountPaid || form.amountPaid >= form.amount)) {
      setError('Amount paid must be greater than 0 and less than the amount charged.');
      return;
    }

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
        throw new Error(d.error ?? 'Failed to save client record');
      }
      router.push('/admin/invoices');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving client record');
      setLoading(false);
    }
  }

  const showAmountPaid = form.status === 'partial';
  const showPaymentMethod = form.status === 'paid' || form.status === 'partial';
  const dateLabel = form.status === 'paid' || form.status === 'partial' ? 'Date Paid' : 'Date Ordered';

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Name</label>
          <input name="clientName" required value={form.clientName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Served By</label>
          <input name="servedBy" value={form.servedBy} onChange={handleChange} className={inputClass} placeholder="e.g. Eugene" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Email</label>
          <input name="clientEmail" type="email" value={form.clientEmail} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Phone</label>
          <input name="clientPhone" value={form.clientPhone} onChange={handleChange} className={inputClass} placeholder="07XXXXXXXX" />
        </div>
      </div>
      <p className="text-xs text-gray-400 -mt-2">At least one of email or phone is required.</p>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Service</label>
        <input name="service" required value={form.service} onChange={handleChange} className={inputClass} placeholder="e.g. Laptop screen replacement" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Amount Charged (KES)</label>
          <input name="amount" type="number" min={1} required value={form.amount || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Expense / Cost (KES)</label>
          <input name="expense" type="number" min={0} value={form.expense || ''} onChange={handleChange} className={inputClass} placeholder="Parts/materials cost, if any" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Payment Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        {showAmountPaid && (
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Amount Paid So Far (KES)</label>
            <input name="amountPaid" type="number" min={1} required value={form.amountPaid || ''} onChange={handleChange} className={inputClass} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">{dateLabel}</label>
          <input name="date" type="date" required value={form.date} onChange={handleChange} className={inputClass} />
        </div>
        {showPaymentMethod && (
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputClass}>
              {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Description (optional)</label>
        <textarea name="description" rows={2} value={form.description} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Defaults to the service name if left blank" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : 'Save Client Record'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
