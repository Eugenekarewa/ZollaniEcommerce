export function formatPrice(amountKes: number) {
  return `KES ${amountKes.toLocaleString('en-KE')}`;
}

export async function generateInvoiceNumber(db: { invoice: { count: () => Promise<number> } }) {
  const count = await db.invoice.count();
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, '0');
  return `ZT-${year}-${seq}`;
}

export const INVOICE_STATUSES: Record<string, { label: string; color: string }> = {
  draft:     { label: 'Draft',     color: 'bg-gray-100 text-gray-700' },
  sent:      { label: 'Sent',      color: 'bg-blue-100 text-blue-800' },
  partial:   { label: 'Partial',   color: 'bg-yellow-100 text-yellow-800' },
  paid:      { label: 'Paid',      color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const REQUEST_STATUSES: Record<string, { label: string; color: string }> = {
  new:    { label: 'New',    color: 'bg-yellow-100 text-yellow-800' },
  quoted: { label: 'Quoted', color: 'bg-blue-100 text-blue-800' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600' },
};
