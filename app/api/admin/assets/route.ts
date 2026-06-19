import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  name:            z.string().min(1),
  category:        z.string().min(1),
  purchaseCost:    z.number().int().min(0),
  purchaseDate:    z.string(), // ISO date string
  usefulLifeYears: z.number().int().min(1).default(3),
  salvageValue:    z.number().int().min(0).default(0),
  notes:           z.string().optional(),
});

export async function GET() {
  const assets = await db.asset.findMany({ orderBy: { purchaseDate: 'desc' } });
  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const asset = await db.asset.create({ data: { ...data, purchaseDate: new Date(data.purchaseDate) } });
    return NextResponse.json(asset, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/assets/POST') }, { status: 400 });
  }
}
