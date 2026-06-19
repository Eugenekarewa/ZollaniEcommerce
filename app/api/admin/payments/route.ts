import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateInvoiceNumber } from '@/lib/invoice';
import { findOrCreateCustomer, placeholderEmail, placeholderEmailForName } from '@/lib/customer';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  clientName:    z.string().min(2),
  clientEmail:   z.string().email().optional().or(z.literal('')),
  clientPhone:   z.string().optional(),
  service:       z.string().min(1),
  description:   z.string().optional(),
  amount:        z.number().int().min(1),
  expense:       z.number().int().min(0).optional(),
  status:        z.enum(['paid', 'partial', 'unpaid', 'cancelled']),
  amountPaid:    z.number().int().min(0).optional(),
  date:          z.string(), // ISO date string
  servedBy:      z.string().optional(),
  paymentMethod: z.enum(['cash', 'mpesa', 'bank', 'paystack', 'other']).optional(),
}).refine((d) => d.clientEmail || d.clientPhone, {
  message: 'Provide at least an email or a phone number',
  path: ['clientEmail'],
}).refine((d) => d.status !== 'partial' || (d.amountPaid != null && d.amountPaid > 0 && d.amountPaid < d.amount), {
  message: 'Amount paid must be greater than 0 and less than the amount charged',
  path: ['amountPaid'],
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const email = data.clientEmail || (data.clientPhone ? placeholderEmail(data.clientPhone) : placeholderEmailForName(data.clientName));
    const customer = await findOrCreateCustomer({ name: data.clientName, email, phone: data.clientPhone });

    const invoiceNumber = await generateInvoiceNumber(db);
    const description = data.description?.trim() || `${data.service}${data.servedBy ? ` (served by ${data.servedBy})` : ''}`;
    const date = new Date(data.date);

    const base = {
      invoiceNumber,
      customerId:  customer.id,
      clientName:  data.clientName,
      clientEmail: email,
      clientPhone: data.clientPhone,
      service:     data.service,
      description,
      amount:      data.amount,
    };

    const invoice = await db.invoice.create({
      data: data.status === 'cancelled' ? {
        ...base, status: 'cancelled',
      } : data.status === 'paid' ? {
        ...base, status: 'paid', amountPaid: data.amount, paidAt: date, paymentMethod: data.paymentMethod ?? 'cash',
      } : data.status === 'partial' ? {
        ...base, status: 'partial', amountPaid: data.amountPaid!, dueDate: date, paidAt: date, paymentMethod: data.paymentMethod ?? 'cash',
      } : {
        ...base, status: 'sent', dueDate: date,
      },
    });

    let expense = null;
    if (data.expense && data.expense > 0) {
      expense = await db.expense.create({
        data: {
          category: 'Service Cost',
          description: `${data.service} — ${data.clientName}`,
          amount: data.expense,
          date,
        },
      });
    }

    return NextResponse.json({ invoice, expense }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/payments/POST') }, { status: 400 });
  }
}
