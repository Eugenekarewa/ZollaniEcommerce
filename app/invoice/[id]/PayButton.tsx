'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';

export default function PayButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/invoice/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not start payment.');
      window.location.href = data.paystackUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={handlePay} disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</>
        ) : (
          <><CreditCard className="h-4 w-4" /> Pay Now — M-Pesa / Card</>
        )}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
