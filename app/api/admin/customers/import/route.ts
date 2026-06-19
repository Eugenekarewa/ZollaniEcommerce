import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseSpreadsheet } from '@/lib/import';
import { findOrCreateCustomer, placeholderEmail } from '@/lib/customer';
import { generateInvoiceNumber } from '@/lib/invoice';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type MonthBucket = { month: string; sortKey: string; paidCount: number; paidTotal: number; unpaidCount: number; unpaidTotal: number };

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const sendReminders = formData.get('sendReminders') === 'true';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { rows, errors } = parseSpreadsheet(buffer);

    let customersCreated = 0;
    let paidCount = 0;
    let paidTotal = 0;
    let unpaidCount = 0;
    let unpaidTotal = 0;

    const monthly = new Map<string, MonthBucket>();
    const records: { name: string; date: string; amount: number; paid: boolean; service: string }[] = [];

    for (const row of rows) {
      try {
        const email = row.email ?? placeholderEmail(row.phone!);
        const before = await db.customer.findUnique({ where: { email } });
        const customer = await findOrCreateCustomer({ name: row.name, email, phone: row.phone });
        if (!before) customersCreated++;

        const invoiceNumber = await generateInvoiceNumber(db);

        const sortKey = `${row.date.getFullYear()}-${String(row.date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = row.date.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
        if (!monthly.has(sortKey)) {
          monthly.set(sortKey, { month: monthLabel, sortKey, paidCount: 0, paidTotal: 0, unpaidCount: 0, unpaidTotal: 0 });
        }
        const bucket = monthly.get(sortKey)!;

        if (row.paid) {
          await db.invoice.create({
            data: {
              invoiceNumber,
              customerId: customer.id,
              clientName: row.name,
              clientEmail: email,
              clientPhone: row.phone,
              service: row.service,
              description: `Imported record — ${row.service}`,
              amount: row.amount,
              status: 'paid',
              paymentMethod: 'imported',
              paidAt: row.date,
            },
          });
          paidCount++;
          paidTotal += row.amount;
          bucket.paidCount++;
          bucket.paidTotal += row.amount;
        } else {
          await db.invoice.create({
            data: {
              invoiceNumber,
              customerId: customer.id,
              clientName: row.name,
              clientEmail: email,
              clientPhone: row.phone,
              service: row.service,
              description: `Imported record — ${row.service}`,
              amount: row.amount,
              status: 'sent',
              dueDate: row.date,
              // Suppress automatic reminders for historical imports unless explicitly requested
              reminderStage: sendReminders ? 0 : 3,
            },
          });
          unpaidCount++;
          unpaidTotal += row.amount;
          bucket.unpaidCount++;
          bucket.unpaidTotal += row.amount;
        }

        records.push({
          name: row.name,
          date: row.date.toISOString(),
          amount: row.amount,
          paid: row.paid,
          service: row.service,
        });
      } catch (rowErr) {
        errors.push({ row: 0, reason: `${row.name}: ${friendlyError(rowErr, 'admin/customers/import row')}` });
      }
    }

    const monthlyBreakdown = Array.from(monthly.values()).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      totalRows: rows.length,
      customersCreated,
      paidCount,
      paidTotal,
      unpaidCount,
      unpaidTotal,
      monthlyBreakdown,
      records,
      errors,
    });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/customers/import') }, { status: 400 });
  }
}
