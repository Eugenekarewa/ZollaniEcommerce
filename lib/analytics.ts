import type { PrismaClient } from '@prisma/client';

function monthBuckets(monthsBack: number) {
  const buckets: { key: string; label: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
    const label = start.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
    buckets.push({ key, label, start, end });
  }
  return buckets;
}

export async function getMonthlyFinancials(db: PrismaClient, monthsBack = 6) {
  const buckets = monthBuckets(monthsBack);
  const rangeStart = buckets[0].start;

  const [receivedInvoices, expenses] = await Promise.all([
    db.invoice.findMany({
      where: { status: { in: ['paid', 'partial'] }, paidAt: { gte: rangeStart } },
      select: { amount: true, amountPaid: true, status: true, paidAt: true },
    }),
    db.expense.findMany({
      where: { date: { gte: rangeStart } },
      select: { amount: true, date: true },
    }),
  ]);

  return buckets.map((b) => {
    const revenue = receivedInvoices
      .filter((i) => i.paidAt && i.paidAt >= b.start && i.paidAt < b.end)
      .reduce((s, i) => s + (i.status === 'paid' ? i.amount : i.amountPaid), 0);
    const expenseTotal = expenses
      .filter((e) => e.date >= b.start && e.date < b.end)
      .reduce((s, e) => s + e.amount, 0);
    return { month: b.label, revenue, expenses: expenseTotal, profit: revenue - expenseTotal };
  });
}

export async function getCustomerGrowth(db: PrismaClient, monthsBack = 6) {
  const buckets = monthBuckets(monthsBack);
  const rangeStart = buckets[0].start;

  const [customers, totalBefore] = await Promise.all([
    db.customer.findMany({ where: { createdAt: { gte: rangeStart } }, select: { createdAt: true } }),
    db.customer.count({ where: { createdAt: { lt: rangeStart } } }),
  ]);

  let running = totalBefore;
  return buckets.map((b) => {
    const newCustomers = customers.filter((c) => c.createdAt >= b.start && c.createdAt < b.end).length;
    running += newCustomers;
    return { month: b.label, newCustomers, totalCustomers: running };
  });
}

export async function getTopServices(db: PrismaClient, monthsBack = 6) {
  const buckets = monthBuckets(monthsBack);
  const rangeStart = buckets[0].start;

  const receivedInvoices = await db.invoice.findMany({
    where: { status: { in: ['paid', 'partial'] }, paidAt: { gte: rangeStart } },
    select: { service: true, amount: true, amountPaid: true, status: true },
  });

  const byService = new Map<string, number>();
  for (const inv of receivedInvoices) {
    const received = inv.status === 'paid' ? inv.amount : inv.amountPaid;
    byService.set(inv.service, (byService.get(inv.service) ?? 0) + received);
  }

  return Array.from(byService.entries())
    .map(([service, revenue]) => ({ service, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
}
