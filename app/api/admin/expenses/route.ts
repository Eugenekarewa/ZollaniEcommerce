import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { friendlyError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const schema = z.object({
  category:    z.string().min(1),
  description: z.string().min(2),
  amount:      z.number().int().min(1),
  date:        z.string(), // ISO date string
  vendor:      z.string().optional(),
  notes:       z.string().optional(),
});

export async function GET() {
  const expenses = await db.expense.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const expense = await db.expense.create({ data: { ...data, date: new Date(data.date) } });
    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err, 'admin/expenses/POST') }, { status: 400 });
  }
}
