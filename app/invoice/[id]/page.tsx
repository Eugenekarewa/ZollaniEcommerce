import { notFound } from 'next/navigation';
import { CheckCircle2, Phone } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, INVOICE_STATUSES } from '@/lib/invoice';
import { siteConfig } from '@/lib/data';
import PaystackVerifier from './PaystackVerifier';
import PayButton from './PayButton';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reference?: string }>;
}) {
  const { id } = await params;
  const { reference } = await searchParams;

  const invoice = await db.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();

  const isPaid = invoice.status === 'paid';
  const statusInfo = INVOICE_STATUSES[invoice.status] ?? { label: invoice.status, color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="bg-gray-50 py-16">
      {reference && !isPaid && (
        <PaystackVerifier invoiceId={id} reference={reference} />
      )}

      <div className="container-wide max-w-lg mx-auto">
        <div className="text-center mb-8">
          {isPaid ? (
            <CheckCircle2 className="h-16 w-16 text-teal mx-auto mb-4 drop-shadow-[0_0_12px_rgba(77,145,144,0.5)]" />
          ) : (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coral-50 text-3xl font-black text-coral shadow-glow-coral">
              KES
            </div>
          )}
          <h1 className="text-2xl font-black text-charcoal">
            {isPaid ? 'Payment Confirmed!' : `Invoice ${invoice.invoiceNumber}`}
          </h1>
          <span className={`inline-block mt-3 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="card space-y-4">
          <div className="text-sm space-y-1 text-gray-600">
            <p><span className="font-medium text-charcoal">Invoice:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-medium text-charcoal">Billed to:</span> {invoice.clientName}</p>
            <p><span className="font-medium text-charcoal">Email:</span> {invoice.clientEmail}</p>
            <p><span className="font-medium text-charcoal">Service:</span> {invoice.service}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{invoice.description}</span>
              <span className="font-medium text-charcoal">{formatPrice(invoice.amount)}</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-charcoal">
            <span>Total Due</span>
            <span className="text-coral text-lg">{formatPrice(invoice.amount)}</span>
          </div>
        </div>

        {!isPaid && invoice.status !== 'cancelled' && (
          <div className="mt-6">
            <PayButton invoiceId={invoice.id} />
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=Hi, my invoice number is ${invoice.invoiceNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex-1 justify-center"
          >
            <Phone className="h-4 w-4" /> WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
