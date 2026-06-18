'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NewCustomerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to create customer');
      }
      const customer = await res.json();
      router.push(`/admin/customers/${customer.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating customer');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
        <input name="name" required value={form.name} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
        <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Company</label>
        <input name="company" value={form.company} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Address</label>
        <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : 'Create Customer'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
