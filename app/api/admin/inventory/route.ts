import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  name:         z.string().min(2),
  sku:          z.string().optional(),
  category:     z.string().min(1),
  quantity:     z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(5),
  unitCost:     z.number().int().min(0).optional(),
  unitPrice:    z.number().int().min(0).optional(),
  supplier:     z.string().optional(),
  notes:        z.string().optional(),
});

export async function GET() {
  const items = await db.inventoryItem.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const item = await db.inventoryItem.create({ data });

    if (item.quantity > 0) {
      await db.inventoryMovement.create({
        data: { itemId: item.id, type: 'restock', quantity: item.quantity, note: 'Initial stock' },
      });
    }

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/inventory/POST') }, { status: 400 });
  }
}
