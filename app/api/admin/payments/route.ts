import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateInvoiceNumber } from '@/lib/invoice';
import { findOrCreateCustomer } from '@/lib/customer';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  clientName:    z.string().min(2),
  clientEmail:   z.string().email(),
  clientPhone:   z.string().optional(),
  service:       z.string().min(1),
  description:   z.string().min(2),
  amount:        z.number().int().min(1),
  paidAt:        z.string(), // ISO date string — when the payment actually happened
  paymentMethod: z.enum(['cash', 'mpesa', 'bank', 'paystack', 'other']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const invoiceNumber = await generateInvoiceNumber(db);
    const customer = await findOrCreateCustomer({
      name:  data.clientName,
      email: data.clientEmail,
      phone: data.clientPhone,
    });

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        clientName:    data.clientName,
        clientEmail:   data.clientEmail,
        clientPhone:   data.clientPhone,
        service:       data.service,
        description:   data.description,
        amount:        data.amount,
        status:        'paid',
        paymentMethod: data.paymentMethod,
        paidAt:        new Date(data.paidAt),
        customerId:    customer.id,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/payments/POST') }, { status: 400 });
  }
}
