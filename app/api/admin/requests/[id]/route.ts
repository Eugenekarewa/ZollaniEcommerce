import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { status } = await req.json();
    const submission = await db.contactSubmission.update({ where: { id }, data: { status } });
    return NextResponse.json(submission);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
