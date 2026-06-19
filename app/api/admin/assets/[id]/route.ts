import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name:            z.string().min(1).optional(),
  category:        z.string().min(1).optional(),
  purchaseCost:    z.number().int().min(0).optional(),
  purchaseDate:    z.string().optional(),
  usefulLifeYears: z.number().int().min(1).optional(),
  salvageValue:    z.number().int().min(0).optional(),
  notes:           z.string().optional(),
  disposed:        z.boolean().optional(),
  disposedAt:      z.string().optional(),
  disposalValue:   z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data = patchSchema.parse(body);
    const asset = await db.asset.update({
      where: { id },
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        disposedAt: data.disposedAt ? new Date(data.disposedAt) : undefined,
      },
    });
    return NextResponse.json(asset);
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/assets/PATCH') }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.asset.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/assets/DELETE') }, { status: 400 });
  }
}
