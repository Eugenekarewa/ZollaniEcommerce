import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes:   z.string().optional(),
});

export async function GET() {
  const customers = await db.customer.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const customer = await db.customer.create({ data });
    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/customers/POST') }, { status: 400 });
  }
}
