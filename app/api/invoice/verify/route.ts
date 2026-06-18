import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyTransaction } from '@/lib/paystack';
import { invoicePaidEmail, resend } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');
  const invoiceId = searchParams.get('invoiceId');

  if (!reference || !invoiceId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    const tx = await verifyTransaction(reference);

    if (tx.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 402 });
    }

    const invoice = await db.invoice.update({
      where: { id: invoiceId },
      data:  { status: 'paid', paystackRef: reference, paidAt: new Date() },
    });

    await resend().emails.send(
      invoicePaidEmail({
        invoiceNumber: invoice.invoiceNumber,
        clientName:    invoice.clientName,
        clientEmail:   invoice.clientEmail,
        amount:        invoice.amount,
      })
    ).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[invoice/verify]', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
