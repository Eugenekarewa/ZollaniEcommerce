'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, CheckCircle2, AlertTriangle, Calendar, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/invoice';

type MonthBucket = {
  month: string; sortKey: string;
  paidCount: number; paidTotal: number;
  unpaidCount: number; unpaidTotal: number;
  partialCount: number; partialTotal: number;
  cancelledCount: number;
};
type ImportRecord = { name: string; date: string; amount: number; amountPaid: number; status: string; service: string };
type SheetHeaders = { sheet: string; headers: string[] };

type ImportResult = {
  totalRows: number;
  customersCreated: number;
  paidCount: number; paidTotal: number;
  unpaidCount: number; unpaidTotal: number;
  partialCount: number; partialTotal: number; partialOutstanding: number;
  cancelledCount: number;
  expensesCreated: number; expensesTotal: number;
  monthlyBreakdown: MonthBucket[];
  records: ImportRecord[];
  errors: { sheet: string; row: number; reason: string }[];
  detectedHeaders: SheetHeaders[];
};

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  unpaid: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ImportForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [sendReminders, setSendReminders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);

  const [importedCounts, setImportedCounts] = useState<{ invoices: number; expenses: number } | null>(null);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState('');

  async function refreshImportedCounts() {
    try {
      const res = await fetch('/api/admin/customers/import/clear');
      const data = await res.json();
      if (res.ok) setImportedCounts(data);
    } catch {
      // non-critical — the clear button just won't show a count
    }
  }

  useEffect(() => {
    refreshImportedCounts();
  }, []);

  async function handleClearImported() {
    if (!importedCounts) return;
    const confirmed = window.confirm(
      `This permanently deletes ${importedCounts.invoices} imported invoice(s) and ${importedCounts.expenses} imported expense(s). ` +
      `Customers and any other invoices are not affected. This cannot be undone. Continue?`
    );
    if (!confirmed) return;

    setClearing(true);
    setClearError('');
    try {
      const res = await fetch('/api/admin/customers/import/clear', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to clear records');
      await refreshImportedCounts();
      router.refresh();
    } catch (err) {
      setClearError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setClearing(false);
    }
  }

  const clearSection = importedCounts && (importedCounts.invoices > 0 || importedCounts.expenses > 0) && (
    <div className="card flex flex-wrap items-center justify-between gap-3 border-red-100 bg-red-50/50">
      <div className="text-sm">
        <p className="font-semibold text-charcoal">Imported records on file</p>
        <p className="text-gray-500">
          {importedCounts.invoices} invoice{importedCounts.invoices !== 1 ? 's' : ''} · {importedCounts.expenses} expense{importedCounts.expenses !== 1 ? 's' : ''} from spreadsheet imports.
          {clearError && <span className="text-red-600 block mt-1">{clearError}</span>}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClearImported}
        disabled={clearing}
        className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-60"
      >
        {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        Clear Imported Records
      </button>
    </div>
  );

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
      refreshImportedCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        {clearSection}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-teal">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="font-bold text-charcoal">Import Complete</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
              <p className="text-xs text-gray-500">Cancelled</p>
              <p className="text-xl font-black text-gray-500">{result.cancelledCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Paid</p>
              <p className="text-xl font-black text-teal">{result.paidCount}</p>
              <p className="text-xs text-gray-400">{formatPrice(result.paidTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Partially Paid</p>
              <p className="text-xl font-black text-yellow-600">{result.partialCount}</p>
              <p className="text-xs text-gray-400">{formatPrice(result.partialTotal)} received, {formatPrice(result.partialOutstanding)} owed</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Unpaid</p>
              <p className="text-xl font-black text-coral">{result.unpaidCount}</p>
              <p className="text-xs text-gray-400">{formatPrice(result.unpaidTotal)}</p>
            </div>
            {result.expensesCreated > 0 && (
              <div>
                <p className="text-xs text-gray-500">Expenses Logged</p>
                <p className="text-xl font-black text-charcoal">{result.expensesCreated}</p>
                <p className="text-xs text-gray-400">{formatPrice(result.expensesTotal)}</p>
              </div>
            )}
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> {result.errors.length} row{result.errors.length !== 1 ? 's' : ''} skipped
              </p>
              <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i}>{e.sheet ? `[${e.sheet}] ` : ''}{e.row > 0 ? `Row ${e.row}: ` : ''}{e.reason}</li>
                ))}
              </ul>
              {result.errors.length >= result.totalRows / 2 && (
                <div className="rounded-lg bg-white border border-red-200 p-3 text-xs text-gray-600 space-y-2">
                  <p className="font-semibold text-charcoal">Columns detected per sheet:</p>
                  {result.detectedHeaders.length > 0 ? (
                    result.detectedHeaders.map((sh) => (
                      <p key={sh.sheet}><span className="font-semibold">{sh.sheet}:</span> <span className="font-mono">{sh.headers.join(' · ')}</span></p>
                    ))
                  ) : (
                    <p>(none found — is the file empty or in an unsupported format?)</p>
                  )}
                  <p className="text-gray-500">
                    If &quot;Name&quot; isn&apos;t in that list, the importer didn&apos;t find your header row —
                    check there isn&apos;t a title or blank row above your actual column headers.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <a href="/admin/customers" className="btn-primary">View Customers</a>
            <a href="/admin/invoices" className="btn-ghost">View Invoices</a>
            <button onClick={() => { setResult(null); setFile(null); }} className="btn-ghost">Import Another File</button>
          </div>
        </div>

        {/* Monthly breakdown */}
        {result.monthlyBreakdown.length > 0 && (
          <div className="card space-y-3">
            <h3 className="font-bold text-charcoal flex items-center gap-2">
              <Calendar className="h-4 w-4 text-coral" /> By Month
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="border-b border-gray-100">
                  <tr className="text-left text-xs text-gray-400 uppercase">
                    <th className="py-2 pr-4">Month</th>
                    <th className="py-2 pr-4">Paid</th>
                    <th className="py-2 pr-4">Partial</th>
                    <th className="py-2 pr-4">Unpaid</th>
                    <th className="py-2">Cancelled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.monthlyBreakdown.map((m) => (
                    <tr key={m.sortKey}>
                      <td className="py-2 pr-4 font-medium text-charcoal">{m.month}</td>
                      <td className="py-2 pr-4 text-teal">{m.paidCount > 0 ? `${formatPrice(m.paidTotal)} (${m.paidCount})` : '—'}</td>
                      <td className="py-2 pr-4 text-yellow-600">{m.partialCount > 0 ? `${formatPrice(m.partialTotal)} (${m.partialCount})` : '—'}</td>
                      <td className="py-2 pr-4 text-coral">{m.unpaidCount > 0 ? `${formatPrice(m.unpaidTotal)} (${m.unpaidCount})` : '—'}</td>
                      <td className="py-2 text-gray-400">{m.cancelledCount > 0 ? m.cancelledCount : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Individual records */}
        {result.records.length > 0 && (
          <div className="card space-y-3">
            <h3 className="font-bold text-charcoal">Imported Records ({result.records.length})</h3>
            <div className="max-h-96 overflow-y-auto overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="border-b border-gray-100 sticky top-0 bg-white">
                  <tr className="text-left text-xs text-gray-400 uppercase">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Service</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.records.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-2 pr-4 text-charcoal">{r.name}</td>
                      <td className="py-2 pr-4 text-gray-500">{r.service}</td>
                      <td className="py-2 pr-4 font-medium text-charcoal">
                        {formatPrice(r.amount)}
                        {r.status === 'partial' && <span className="text-xs text-gray-400"> ({formatPrice(r.amountPaid)} paid)</span>}
                      </td>
                      <td className="py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clearSection}
      <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-charcoal text-sm mb-1">Expected columns (any order, header names are flexible):</p>
        <p><strong>Name</strong> · <strong>Email or Phone</strong> · <strong>Amount</strong> · <strong>Paid/Unpaid</strong> · <strong>Date</strong> · <strong>Service</strong></p>
        <p>Also recognized: <strong>Expense</strong> (logged automatically), <strong>Served By</strong>, partial payments like &quot;Paid 800&quot;, and &quot;Cancelled&quot;. If your file has a separate sheet/tab per month, all of them are imported together.</p>
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
          <span className="font-medium text-charcoal">Send automatic payment reminders for imported unpaid/partial invoices</span>
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
    </div>
  );
}
