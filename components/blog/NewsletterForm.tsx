'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res  = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');

      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-3 rounded-xl border border-teal/30 bg-teal/10 px-6 py-4 text-sm text-teal-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm flex-col gap-3">
      <div className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary shrink-0 py-3 disabled:opacity-60"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-center text-xs text-red-400">{message}</p>
      )}
    </form>
  );
}
