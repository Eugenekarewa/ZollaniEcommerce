import { db } from './db';

/** Customer.email is required + unique. For records that only have a phone
 * number (e.g. an imported spreadsheet row), derive a stable placeholder so
 * the same phone always maps to the same customer. */
export function placeholderEmail(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `${digits}@no-email.zollani.local`;
}

/** For records with neither email nor phone (e.g. a walk-in cash customer in
 * an imported spreadsheet), derive a stable placeholder from the name so
 * repeat mentions of the same name still group under one customer. */
export function placeholderEmailForName(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
  return `${slug}@no-contact.zollani.local`;
}

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
