import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initializeTransaction } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { invoiceId } = await req.json();
    const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }
    if (invoice.status === 'cancelled') {
      return NextResponse.json({ error: 'Invoice has been cancelled' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zollani.co.ke';
    const { authorization_url } = await initializeTransaction({
      email:       invoice.clientEmail,
      amount:      invoice.amount,
      reference:   invoice.id,
      callbackUrl: `${siteUrl}/invoice/${invoice.id}`,
    });

    return NextResponse.json({ paystackUrl: authorization_url });
  } catch (err) {
    console.error('[invoice/pay]', err);
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 500 });
  }
}
