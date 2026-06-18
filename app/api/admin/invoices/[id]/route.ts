import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { status } = await req.json();
    const data: { status: string; paidAt?: Date } = { status };
    if (status === 'paid') data.paidAt = new Date();
    const invoice = await db.invoice.update({ where: { id }, data });
    return NextResponse.json(invoice);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
