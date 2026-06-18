import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  type:     z.enum(['restock', 'used', 'adjustment']),
  quantity: z.number().int(), // signed: positive for restock, negative for used
  note:     z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const item = await db.inventoryItem.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    const newQuantity = item.quantity + data.quantity;
    if (newQuantity < 0) {
      return NextResponse.json({ error: `Not enough stock — only ${item.quantity} available.` }, { status: 400 });
    }

    const [, movement] = await db.$transaction([
      db.inventoryItem.update({ where: { id }, data: { quantity: newQuantity } }),
      db.inventoryMovement.create({ data: { itemId: id, ...data } }),
    ]);

    return NextResponse.json(movement, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/inventory/movements/POST') }, { status: 400 });
  }
}
