import { db } from './db';

export async function findOrCreateCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}) {
  const existing = await db.customer.findUnique({ where: { email: data.email } });
  if (existing) {
    // Backfill phone/company if the customer record is missing them
    if ((!existing.phone && data.phone) || (!existing.company && data.company)) {
      return db.customer.update({
        where: { id: existing.id },
        data: {
          phone: existing.phone ?? data.phone,
          company: existing.company ?? data.company,
        },
      });
    }
    return existing;
  }

  return db.customer.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
    },
  });
}
