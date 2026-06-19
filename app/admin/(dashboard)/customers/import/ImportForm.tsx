'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/invoice';

type ImportResult = {
  totalRows: number;
  customersCreated: number;
  paidCount: number;
  paidTotal: number;
  unpaidCount: number;
  unpaidTotal: number;
  errors: { row: number; reason: string }[];
};

export default function ImportForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [sendReminders, setSendReminders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sendReminders', String(sendReminders));

      const res = await fetch('/api/admin/customers/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Import failed');

      setResult(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-teal">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="font-bold text-charcoal">Import Complete</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Rows Processed</p>
              <p className="text-xl font-black text-charcoal">{result.totalRows}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Customers Added</p>
              <p className="text-xl font-black text-charcoal">{result.customersCreated}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Skipped (errors)</p>
              <p className="text-xl font-black text-red-600">{result.errors.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Paid Invoices</p>
              <p className="text-xl font-black text-teal">{result.paidCount}</p>
              <p className="text-xs text-gray-400">{formatPrice(result.paidTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Unpaid Invoices</p>
              <p className="text-xl font-black text-coral">{result.unpaidCount}</p>
              <p className="text-xs text-gray-400">{formatPrice(result.unpaidTotal)}</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> {result.errors.length} row{result.errors.length !== 1 ? 's' : ''} skipped
              </p>
              <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i}>{e.row > 0 ? `Row ${e.row}: ` : ''}{e.reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <a href="/admin/customers" className="btn-primary">View Customers</a>
            <a href="/admin/invoices" className="btn-ghost">View Invoices</a>
            <button onClick={() => { setResult(null); setFile(null); }} className="btn-ghost">Import Another File</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-charcoal text-sm mb-1">Expected columns (any order, header names are flexible):</p>
        <p><strong>Name</strong> · <strong>Email or Phone</strong> · <strong>Amount</strong> · <strong>Paid/Unpaid</strong> · <strong>Date</strong> · <strong>Service</strong></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Spreadsheet File (.xlsx, .xls, .csv)</label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200 file:mr-4 file:rounded-lg file:border-0 file:bg-coral-50 file:px-3 file:py-1.5 file:text-coral file:font-medium"
        />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={sendReminders}
          onChange={(e) => setSendReminders(e.target.checked)}
          className="mt-0.5 accent-coral"
        />
        <span className="text-sm">
          <span className="font-medium text-charcoal">Send automatic payment reminders for imported unpaid invoices</span>
          <p className="text-gray-500 mt-0.5">
            Off by default — historical debts won&apos;t suddenly email old customers. Turn this on
            if you want the normal due-soon / overdue / final-notice reminders to apply to them.
          </p>
        </span>
      </label>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <button type="submit" disabled={loading || !file} className="btn-primary disabled:opacity-60">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing…</> : <><Upload className="h-4 w-4" /> Import Customers</>}
      </button>
    </form>
  );
}
