import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseSpreadsheet } from '@/lib/import';
import { findOrCreateCustomer, placeholderEmail } from '@/lib/customer';
import { generateInvoiceNumber } from '@/lib/invoice';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

    for (const row of rows) {
      try {
        const email = row.email ?? placeholderEmail(row.phone!);
        const before = await db.customer.findUnique({ where: { email } });
        const customer = await findOrCreateCustomer({ name: row.name, email, phone: row.phone });
        if (!before) customersCreated++;

        const invoiceNumber = await generateInvoiceNumber(db);

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
        }
      } catch (rowErr) {
        errors.push({ row: 0, reason: `${row.name}: ${friendlyError(rowErr, 'admin/customers/import row')}` });
      }
    }

    return NextResponse.json({
      totalRows: rows.length,
      customersCreated,
      paidCount,
      paidTotal,
      unpaidCount,
      unpaidTotal,
      errors,
    });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/customers/import') }, { status: 400 });
  }
}
