import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { notes, tags } = await req.json();
    const customer = await db.customer.update({ where: { id }, data: { notes, tags } });
    return NextResponse.json(customer);
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/customers/PUT') }, { status: 400 });
  }
}
