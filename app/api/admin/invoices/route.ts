import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateInvoiceNumber } from '@/lib/invoice';
import { invoiceEmail, resend } from '@/lib/email';

export const dynamic = 'force-dynamic';

const schema = z.object({
  contactSubmissionId: z.string().optional(),
  clientName:  z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  service:     z.string().min(1),
  description: z.string().min(3),
  amount:      z.number().int().min(1),
});

export async function GET() {
  const invoices = await db.invoice.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const invoiceNumber = await generateInvoiceNumber(db);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zollani.co.ke';

    const invoice = await db.invoice.create({
      data: { ...data, invoiceNumber, status: 'sent' },
    });

    if (data.contactSubmissionId) {
      await db.contactSubmission.update({
        where: { id: data.contactSubmissionId },
        data: { status: 'quoted' },
      }).catch(() => {});
    }

    await resend().emails.send(
      invoiceEmail({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        service: invoice.service,
        description: invoice.description,
        amount: invoice.amount,
        payUrl: `${siteUrl}/invoice/${invoice.id}`,
      })
    ).catch(() => {});

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
