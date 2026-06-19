'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2, Trash2, CheckCircle2 } from 'lucide-react';

type Counts = { customers: number; invoices: number; submissions: number; expenses: number };

const CONFIRM_PHRASE = 'DELETE EVERYTHING';

export default function SettingsPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Counts | null>(null);

  async function loadCounts() {
    try {
      const res = await fetch('/api/admin/reset');
      const data = await res.json();
      if (res.ok) setCounts(data);
    } catch {
      // non-critical
    }
  }

  useEffect(() => {
    loadCounts();
  }, []);

  async function handleReset() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reset', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Reset failed');
      setDone({
        customers: data.customersDeleted,
        invoices: data.invoicesDeleted,
        submissions: data.submissionsDeleted,
        expenses: data.expensesDeleted,
      });
      setConfirming(false);
      setConfirmText('');
      await loadCounts();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">System maintenance and data management</p>
      </div>

      <div className="card border-red-200 space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="font-bold text-charcoal">Danger Zone</h2>
        </div>

        {done && (
          <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 text-sm text-teal-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Reset complete — removed {done.customers} customer{done.customers !== 1 ? 's' : ''},{' '}
              {done.invoices} invoice{done.invoices !== 1 ? 's' : ''}, {done.submissions} service request{done.submissions !== 1 ? 's' : ''},
              and {done.expenses} expense{done.expenses !== 1 ? 's' : ''}. Inventory was not affected.
            </span>
          </div>
        )}

        <div className="rounded-xl bg-red-50 border border-red-100 p-4 space-y-2">
          <p className="text-sm font-semibold text-charcoal">Reset All Business Data</p>
          <p className="text-sm text-gray-600">
            Permanently deletes every customer, invoice, service request, and logged expense.
            Inventory items are not affected. This cannot be undone — use it only when you want
            to wipe everything and start over with a clean import.
          </p>

          {counts && (
            <p className="text-xs text-gray-500">
              Currently on file: {counts.customers} customers · {counts.invoices} invoices ·{' '}
              {counts.submissions} service requests · {counts.expenses} expenses
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={!counts || (counts.customers === 0 && counts.invoices === 0 && counts.submissions === 0 && counts.expenses === 0)}
              className="btn-ghost text-red-600 border-red-200 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Reset All Business Data
            </button>
          ) : (
            <div className="space-y-3 rounded-xl bg-white border border-red-200 p-4">
              <p className="text-sm text-charcoal">
                Type <span className="font-mono font-bold">{CONFIRM_PHRASE}</span> to confirm. This is irreversible.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={confirmText !== CONFIRM_PHRASE || loading}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : 'Confirm Permanent Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => { setConfirming(false); setConfirmText(''); }}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
