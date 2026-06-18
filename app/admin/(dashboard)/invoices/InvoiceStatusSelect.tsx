'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INVOICE_STATUSES } from '@/lib/invoice';

export default function InvoiceStatusSelect({ invoiceId, current }: { invoiceId: string; current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setValue(newStatus);
    setLoading(true);
    await fetch(`/api/admin/invoices/${invoiceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      className="text-xs font-semibold rounded-full border border-gray-200 px-3 py-1.5 bg-white cursor-pointer disabled:opacity-60"
    >
      {Object.entries(INVOICE_STATUSES).map(([k, v]) => (
        <option key={k} value={k}>{v.label}</option>
      ))}
    </select>
  );
}
