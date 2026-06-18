import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentReminderEmail, paymentReminderWhatsAppMessage, resend } from '@/lib/email';
import { sendWhatsApp } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Days-relative-to-due-date thresholds for each reminder stage.
// Stage 1 fires once due date is ≤1 day away (or just passed).
// Stage 2 fires once 3+ days overdue. Stage 3 (final) fires once 7+ days overdue.
const STAGE_THRESHOLDS: Record<number, number> = { 1: 1, 2: -3, 3: -7 };

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zollani.co.ke';
  const now = Date.now();

  const unpaidInvoices = await db.invoice.findMany({
    where: { status: 'sent', dueDate: { not: null } },
  });

  const results: { invoiceNumber: string; stage: number; emailSent: boolean; whatsappSent: boolean }[] = [];

  for (const invoice of unpaidInvoices) {
    if (!invoice.dueDate || invoice.reminderStage >= 3) continue;

    const daysUntilDue = Math.floor((invoice.dueDate.getTime() - now) / (24 * 60 * 60 * 1000));

    let nextStage: number | null = null;
    if (invoice.reminderStage < 1 && daysUntilDue <= STAGE_THRESHOLDS[1]) nextStage = 1;
    if (invoice.reminderStage < 2 && daysUntilDue <= STAGE_THRESHOLDS[2]) nextStage = 2;
    if (invoice.reminderStage < 3 && daysUntilDue <= STAGE_THRESHOLDS[3]) nextStage = 3;

    if (!nextStage) continue;

    const payUrl = `${siteUrl}/invoice/${invoice.id}`;
    let emailSent = false;
    let whatsappSent = false;

    try {
      await resend().emails.send(
        paymentReminderEmail({
          stage: nextStage as 1 | 2 | 3,
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          service: invoice.service,
          amount: invoice.amount,
          dueDate: invoice.dueDate,
          payUrl,
        })
      );
      emailSent = true;
    } catch (err) {
      console.error(`[cron/payment-reminders] email failed for ${invoice.invoiceNumber}`, err);
    }

    if (invoice.clientPhone) {
      const wa = await sendWhatsApp({
        to: invoice.clientPhone,
        body: paymentReminderWhatsAppMessage({
          stage: nextStage as 1 | 2 | 3,
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          amount: invoice.amount,
          payUrl,
        }),
      }).catch(() => ({ sent: false as const }));
      whatsappSent = wa.sent;
    }

    await db.invoice.update({
      where: { id: invoice.id },
      data: { reminderStage: nextStage, lastReminderAt: new Date() },
    });

    results.push({ invoiceNumber: invoice.invoiceNumber, stage: nextStage, emailSent, whatsappSent });
  }

  return NextResponse.json({ processed: results.length, results });
}
