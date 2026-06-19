import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const PLACEHOLDER_DOMAINS = ['@no-email.zollani.local', '@no-contact.zollani.local'];

async function countImported() {
  const [invoices, expenses] = await Promise.all([
    db.invoice.count({ where: { paymentMethod: 'imported' } }),
    db.expense.count({ where: { category: 'Imported' } }),
  ]);
  return { invoices, expenses };
}

// Preview counts for the confirmation dialog.
export async function GET() {
  try {
    const counts = await countImported();
    return NextResponse.json(counts);
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/customers/import/clear GET') }, { status: 400 });
  }
}

// Deletes everything created by a spreadsheet import: invoices, the expenses
// logged alongside them, and any placeholder customer records (no real email
// or phone — identified by their @no-*.zollani.local domain) left with no
// remaining invoices or service requests. Real customers and any invoice not
// created via import are never touched.
export async function DELETE() {
  try {
    const { invoices: invoicesDeleted, expenses: expensesDeleted } = await db.$transaction(async (tx) => {
      const invoices = await tx.invoice.deleteMany({ where: { paymentMethod: 'imported' } });
      const expenses = await tx.expense.deleteMany({ where: { category: 'Imported' } });
      return { invoices: invoices.count, expenses: expenses.count };
    });

    const orphanPlaceholders = await db.customer.findMany({
      where: {
        OR: PLACEHOLDER_DOMAINS.map((domain) => ({ email: { endsWith: domain } })),
        invoices: { none: {} },
        submissions: { none: {} },
      },
      select: { id: true },
    });
    const { count: customersDeleted } = await db.customer.deleteMany({
      where: { id: { in: orphanPlaceholders.map((c) => c.id) } },
    });

    return NextResponse.json({ invoicesDeleted, expensesDeleted, customersDeleted });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/customers/import/clear DELETE') }, { status: 400 });
  }
}
