import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

async function counts() {
  const [customers, invoices, submissions, expenses] = await Promise.all([
    db.customer.count(),
    db.invoice.count(),
    db.contactSubmission.count(),
    db.expense.count(),
  ]);
  return { customers, invoices, submissions, expenses };
}

// Preview counts for the confirmation dialog.
export async function GET() {
  try {
    return NextResponse.json(await counts());
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/reset GET') }, { status: 400 });
  }
}

// Full business-data reset: wipes customers, invoices, service requests, and
// expenses so the system can be started over with clean, accurate data.
// Inventory items/movements are left untouched — they're a separate concern
// from customer/financial records.
export async function DELETE() {
  try {
    const result = await db.$transaction(async (tx) => {
      // Invoices reference customers/submissions, so they go first.
      const invoices = await tx.invoice.deleteMany({});
      const submissions = await tx.contactSubmission.deleteMany({});
      const customers = await tx.customer.deleteMany({});
      const expenses = await tx.expense.deleteMany({});
      return {
        customersDeleted: customers.count,
        invoicesDeleted: invoices.count,
        submissionsDeleted: submissions.count,
        expensesDeleted: expenses.count,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/reset DELETE') }, { status: 400 });
  }
}
