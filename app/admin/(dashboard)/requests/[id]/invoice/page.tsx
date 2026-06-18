import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import InvoiceForm from './InvoiceForm';

export default async function CreateInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await db.contactSubmission.findUnique({ where: { id } });
  if (!request) notFound();

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Create Invoice</h1>
        <p className="text-sm text-gray-500 mt-1">For {request.name}&apos;s {request.service} request</p>
      </div>
      <InvoiceForm request={request} />
    </div>
  );
}
