'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type Request = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
};

export default function InvoiceForm({ request }: { request: Request }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName:  request.name,
    clientEmail: request.email,
    clientPhone: request.phone ?? '',
    service:     request.service,
    description: '',
    amount:      0,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'amount' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, contactSubmissionId: request.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to create invoice');
      }
      router.push('/admin/invoices');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating invoice');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Name</label>
          <input name="clientName" required value={form.clientName} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Client Email</label>
          <input name="clientEmail" type="email" required value={form.clientEmail} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Client Phone</label>
        <input name="clientPhone" value={form.clientPhone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Service</label>
        <input name="service" required value={form.service} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Description / Work Done</label>
        <textarea
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="e.g. Screen replacement + RAM upgrade (8GB)"
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Amount (KES)</label>
        <input name="amount" type="number" required min={1} value={form.amount || ''} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : 'Create & Send Invoice'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
