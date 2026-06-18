import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const item = await db.inventoryItem.update({ where: { id }, data: body });
    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/inventory/PUT') }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.inventoryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/inventory/DELETE') }, { status: 400 });
  }
}
