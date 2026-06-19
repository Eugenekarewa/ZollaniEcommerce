import Link from 'next/link';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { getProfitAndLoss, getBalanceSheet, getCashFlowStatement } from '@/lib/accounting';

export const dynamic = 'force-dynamic';

const TABS = [
  { key: 'pl', label: 'Profit & Loss' },
  { key: 'balance', label: 'Balance Sheet' },
  { key: 'cashflow', label: 'Cash Flow' },
] as const;

const PERIODS = [
  { key: 'thismonth', label: 'This Month' },
  { key: 'lastmonth', label: 'Last Month' },
  { key: 'thisquarter', label: 'This Quarter' },
  { key: 'thisyear', label: 'This Year' },
  { key: 'alltime', label: 'All Time' },
] as const;

function startOfMonth(y: number, m: number) {
  return new Date(y, m, 1);
}

function getPeriodRange(key: string): { start: Date; end: Date; label: string } {
  const now = new Date();
  switch (key) {
    case 'lastmonth':
      return { start: startOfMonth(now.getFullYear(), now.getMonth() - 1), end: startOfMonth(now.getFullYear(), now.getMonth()), label: 'Last Month' };
    case 'thisquarter': {
      const qStartMonth = Math.floor(now.getMonth() / 3) * 3;
      return { start: startOfMonth(now.getFullYear(), qStartMonth), end: startOfMonth(now.getFullYear(), qStartMonth + 3), label: 'This Quarter' };
    }
    case 'thisyear':
      return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear() + 1, 0, 1), label: 'This Year' };
    case 'alltime':
      return { start: new Date(2000, 0, 1), end: new Date(now.getFullYear() + 1, 0, 1), label: 'All Time' };
    case 'thismonth':
    default:
      return { start: startOfMonth(now.getFullYear(), now.getMonth()), end: startOfMonth(now.getFullYear(), now.getMonth() + 1), label: 'This Month' };
  }
}

export default async function AccountingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; range?: string }>;
}) {
  const { tab: tabParam, range: rangeParam } = await searchParams;
  const tab = TABS.some((t) => t.key === tabParam) ? tabParam! : 'pl';
  const rangeKey = PERIODS.some((p) => p.key === rangeParam) ? rangeParam! : 'thismonth';
  const { start, end, label } = getPeriodRange(rangeKey);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Accounting</h1>
        <p className="text-gray-500 text-sm mt-1">Prepared on a cash basis — revenue is recognized when collected, not when invoiced.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin/accounting?tab=${t.key}&range=${rangeKey}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === t.key ? 'bg-white text-coral shadow-sm' : 'text-gray-500 hover:text-charcoal'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {tab !== 'balance' && (
          <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1">
            {PERIODS.map((p) => (
              <Link
                key={p.key}
                href={`/admin/accounting?tab=${tab}&range=${p.key}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  rangeKey === p.key ? 'bg-white text-coral shadow-sm' : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {tab === 'pl' && <ProfitAndLoss start={start} end={end} label={label} />}
      {tab === 'balance' && <BalanceSheet />}
      {tab === 'cashflow' && <CashFlow start={start} end={end} label={label} />}
    </div>
  );
}

async function ProfitAndLoss({ start, end, label }: { start: Date; end: Date; label: string }) {
  const pl = await getProfitAndLoss(db, start, end);

  return (
    <div className="card max-w-2xl space-y-6">
      <div>
        <h2 className="font-bold text-charcoal">Profit & Loss Statement</h2>
        <p className="text-xs text-gray-400">{label} · {start.toLocaleDateString('en-KE')} – {new Date(end.getTime() - 86400000).toLocaleDateString('en-KE')}</p>
      </div>

      <div>
        <div className="flex justify-between items-center font-semibold text-charcoal border-b border-gray-100 pb-2 mb-2">
          <span>Revenue</span>
          <span className="text-teal">{formatPrice(pl.revenue)}</span>
        </div>
        {pl.revenueByService.length === 0 ? (
          <p className="text-sm text-gray-400">No revenue collected this period.</p>
        ) : (
          <div className="space-y-1.5">
            {pl.revenueByService.map((r) => (
              <div key={r.service} className="flex justify-between text-sm text-gray-500 pl-2">
                <span>{r.service}</span>
                <span>{formatPrice(r.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center font-semibold text-charcoal border-b border-gray-100 pb-2 mb-2">
          <span>Expenses</span>
          <span className="text-coral">{formatPrice(pl.totalExpenses)}</span>
        </div>
        {pl.expensesByCategory.length === 0 ? (
          <p className="text-sm text-gray-400">No expenses logged this period.</p>
        ) : (
          <div className="space-y-1.5">
            {pl.expensesByCategory.map((e) => (
              <div key={e.category} className="flex justify-between text-sm text-gray-500 pl-2">
                <span>{e.category}</span>
                <span>{formatPrice(e.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-t-2 border-charcoal pt-3">
        <span className="font-bold text-charcoal">Net Profit</span>
        <span className={`text-xl font-black ${pl.netProfit >= 0 ? 'text-teal' : 'text-red-600'}`}>{formatPrice(pl.netProfit)}</span>
      </div>
    </div>
  );
}

async function BalanceSheet() {
  const bs = await getBalanceSheet(db);

  return (
    <div className="card max-w-2xl space-y-6">
      <div>
        <h2 className="font-bold text-charcoal">Balance Sheet</h2>
        <p className="text-xs text-gray-400">As of {bs.asOfDate.toLocaleDateString('en-KE')}</p>
      </div>

      <div>
        <p className="font-semibold text-charcoal border-b border-gray-100 pb-2 mb-2">Assets</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500 pl-2"><span>Cash & Equivalents</span><span className={bs.cash < 0 ? 'text-red-600' : ''}>{formatPrice(bs.cash)}</span></div>
          <div className="flex justify-between text-gray-500 pl-2"><span>Accounts Receivable</span><span>{formatPrice(bs.accountsReceivable)}</span></div>
          <div className="flex justify-between text-gray-500 pl-2"><span>Fixed Assets, net of depreciation</span><span>{formatPrice(bs.fixedAssetsNet)}</span></div>
          <p className="text-xs text-gray-400 pl-2">({formatPrice(bs.fixedAssetsGross)} gross − {formatPrice(bs.fixedAssetsAccumDepreciation)} accumulated depreciation)</p>
        </div>
        <div className="flex justify-between items-center font-semibold text-charcoal border-t border-gray-100 mt-2 pt-2">
          <span>Total Assets</span>
          <span>{formatPrice(bs.totalAssets)}</span>
        </div>
      </div>

      <div>
        <p className="font-semibold text-charcoal border-b border-gray-100 pb-2 mb-2">Liabilities</p>
        <p className="text-sm text-gray-400 pl-2">Not tracked by this system (loans, supplier credit, etc.)</p>
        <div className="flex justify-between items-center font-semibold text-charcoal border-t border-gray-100 mt-2 pt-2">
          <span>Total Liabilities</span>
          <span>{formatPrice(bs.totalLiabilities)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t-2 border-charcoal pt-3">
        <span className="font-bold text-charcoal">Owner&apos;s Equity</span>
        <span className={`text-xl font-black ${bs.ownersEquity >= 0 ? 'text-teal' : 'text-red-600'}`}>{formatPrice(bs.ownersEquity)}</span>
      </div>

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
        Cash is estimated as cumulative revenue collected minus expenses paid and asset purchases — this system
        doesn&apos;t reconcile against an actual bank account, so treat it as an estimate.
      </p>
    </div>
  );
}

async function CashFlow({ start, end, label }: { start: Date; end: Date; label: string }) {
  const cf = await getCashFlowStatement(db, start, end);

  return (
    <div className="card max-w-2xl space-y-6">
      <div>
        <h2 className="font-bold text-charcoal">Cash Flow Statement</h2>
        <p className="text-xs text-gray-400">{label} · {start.toLocaleDateString('en-KE')} – {new Date(end.getTime() - 86400000).toLocaleDateString('en-KE')}</p>
      </div>

      <div>
        <p className="font-semibold text-charcoal border-b border-gray-100 pb-2 mb-2">Operating Activities</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500 pl-2"><span>Cash collected from customers</span><span className="text-teal">{formatPrice(cf.cashCollected)}</span></div>
          <div className="flex justify-between text-gray-500 pl-2"><span>Cash paid for expenses</span><span className="text-coral">−{formatPrice(cf.cashPaidExpenses)}</span></div>
        </div>
        <div className="flex justify-between items-center font-semibold text-charcoal border-t border-gray-100 mt-2 pt-2">
          <span>Net Cash from Operations</span>
          <span>{formatPrice(cf.netOperating)}</span>
        </div>
      </div>

      <div>
        <p className="font-semibold text-charcoal border-b border-gray-100 pb-2 mb-2">Investing Activities</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500 pl-2"><span>Cash paid for asset purchases</span><span className="text-coral">−{formatPrice(cf.cashPaidForAssets)}</span></div>
          <div className="flex justify-between text-gray-500 pl-2"><span>Proceeds from asset disposals</span><span className="text-teal">{formatPrice(cf.cashFromAssetDisposals)}</span></div>
        </div>
        <div className="flex justify-between items-center font-semibold text-charcoal border-t border-gray-100 mt-2 pt-2">
          <span>Net Cash from Investing</span>
          <span>{formatPrice(cf.netInvesting)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t-2 border-charcoal pt-3">
        <span className="font-bold text-charcoal">Net Change in Cash</span>
        <span className={`text-xl font-black ${cf.netChangeInCash >= 0 ? 'text-teal' : 'text-red-600'}`}>{formatPrice(cf.netChangeInCash)}</span>
      </div>
    </div>
  );
}
