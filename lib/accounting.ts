import type { PrismaClient } from '@prisma/client';
import { depreciate } from './asset';

/** All statements are prepared on a cash basis — revenue is recognized when
 * collected (paidAt), not when invoiced — consistent with the rest of the
 * admin's Analytics page. Liabilities (loans, supplier credit) are not
 * tracked by this system, so the Balance Sheet reports them as zero. */

export async function getProfitAndLoss(db: PrismaClient, start: Date, end: Date) {
  const [revenueInvoices, expenses] = await Promise.all([
    db.invoice.findMany({
      where: { status: { in: ['paid', 'partial'] }, paidAt: { gte: start, lt: end } },
      select: { amount: true, amountPaid: true, status: true, service: true },
    }),
    db.expense.findMany({
      where: { date: { gte: start, lt: end } },
      select: { amount: true, category: true },
    }),
  ]);

  const revenueByService = new Map<string, number>();
  let revenue = 0;
  for (const inv of revenueInvoices) {
    const received = inv.status === 'paid' ? inv.amount : inv.amountPaid;
    revenue += received;
    revenueByService.set(inv.service, (revenueByService.get(inv.service) ?? 0) + received);
  }

  const expensesByCategory = new Map<string, number>();
  let totalExpenses = 0;
  for (const exp of expenses) {
    totalExpenses += exp.amount;
    expensesByCategory.set(exp.category, (expensesByCategory.get(exp.category) ?? 0) + exp.amount);
  }

  return {
    revenue,
    revenueByService: Array.from(revenueByService.entries()).map(([service, amount]) => ({ service, amount })).sort((a, b) => b.amount - a.amount),
    totalExpenses,
    expensesByCategory: Array.from(expensesByCategory.entries()).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount),
    netProfit: revenue - totalExpenses,
  };
}

export async function getBalanceSheet(db: PrismaClient, asOfDate: Date = new Date()) {
  const [collectedInvoices, expensesAllTime, assetsAllTime, sentInvoices, partialInvoices] = await Promise.all([
    db.invoice.findMany({
      where: { status: { in: ['paid', 'partial'] }, paidAt: { lte: asOfDate } },
      select: { amount: true, amountPaid: true, status: true },
    }),
    db.expense.aggregate({ _sum: { amount: true }, where: { date: { lte: asOfDate } } }),
    db.asset.findMany({ where: { purchaseDate: { lte: asOfDate } } }),
    db.invoice.aggregate({ _sum: { amount: true }, where: { status: 'sent', createdAt: { lte: asOfDate } } }),
    db.invoice.findMany({ where: { status: 'partial', createdAt: { lte: asOfDate } }, select: { amount: true, amountPaid: true } }),
  ]);

  const cashCollected = collectedInvoices.reduce((s, i) => s + (i.status === 'paid' ? i.amount : i.amountPaid), 0);
  const expensesPaid = expensesAllTime._sum.amount ?? 0;

  const assetPurchases = assetsAllTime.reduce((s, a) => s + a.purchaseCost, 0);
  const assetDisposalProceeds = assetsAllTime.reduce((s, a) => {
    if (a.disposed && a.disposedAt && a.disposedAt <= asOfDate && a.disposalValue) return s + a.disposalValue;
    return s;
  }, 0);

  const cash = cashCollected - expensesPaid - assetPurchases + assetDisposalProceeds;

  const accountsReceivable = (sentInvoices._sum.amount ?? 0) + partialInvoices.reduce((s, i) => s + (i.amount - i.amountPaid), 0);

  const ownedAssets = assetsAllTime.filter((a) => !a.disposed || (a.disposedAt && a.disposedAt > asOfDate));
  let fixedAssetsGross = 0;
  let fixedAssetsAccumDepreciation = 0;
  let fixedAssetsNet = 0;
  for (const asset of ownedAssets) {
    const { accumulatedDepreciation, bookValue } = depreciate(asset, asOfDate);
    fixedAssetsGross += asset.purchaseCost;
    fixedAssetsAccumDepreciation += accumulatedDepreciation;
    fixedAssetsNet += bookValue;
  }

  const totalAssets = cash + accountsReceivable + fixedAssetsNet;
  const totalLiabilities = 0;
  const ownersEquity = totalAssets - totalLiabilities;

  return {
    asOfDate,
    cash,
    accountsReceivable,
    fixedAssetsGross,
    fixedAssetsAccumDepreciation,
    fixedAssetsNet,
    totalAssets,
    totalLiabilities,
    ownersEquity,
  };
}

export async function getCashFlowStatement(db: PrismaClient, start: Date, end: Date) {
  const [collectedInvoices, expensesPeriod, assetsPurchased, assetsDisposed] = await Promise.all([
    db.invoice.findMany({
      where: { status: { in: ['paid', 'partial'] }, paidAt: { gte: start, lt: end } },
      select: { amount: true, amountPaid: true, status: true },
    }),
    db.expense.aggregate({ _sum: { amount: true }, where: { date: { gte: start, lt: end } } }),
    db.asset.aggregate({ _sum: { purchaseCost: true }, where: { purchaseDate: { gte: start, lt: end } } }),
    db.asset.findMany({ where: { disposed: true, disposedAt: { gte: start, lt: end } }, select: { disposalValue: true } }),
  ]);

  const cashCollected = collectedInvoices.reduce((s, i) => s + (i.status === 'paid' ? i.amount : i.amountPaid), 0);
  const cashPaidExpenses = expensesPeriod._sum.amount ?? 0;
  const netOperating = cashCollected - cashPaidExpenses;

  const cashPaidForAssets = assetsPurchased._sum.purchaseCost ?? 0;
  const cashFromAssetDisposals = assetsDisposed.reduce((s, a) => s + (a.disposalValue ?? 0), 0);
  const netInvesting = cashFromAssetDisposals - cashPaidForAssets;

  const netChangeInCash = netOperating + netInvesting;

  return {
    cashCollected,
    cashPaidExpenses,
    netOperating,
    cashPaidForAssets,
    cashFromAssetDisposals,
    netInvesting,
    netChangeInCash,
  };
}
