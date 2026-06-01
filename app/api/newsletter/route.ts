import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { resend, newsletterWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check for duplicate
    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: true, message: 'You\'re already subscribed!' },
        { status: 200 }
      );
    }

    // Store subscriber
    await db.newsletterSubscriber.create({ data: { email } });

    // Send welcome email
    await resend().emails.send(newsletterWelcomeEmail(email));

    return NextResponse.json(
      { success: true, message: 'Subscribed! Check your inbox for a welcome email.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[newsletter/POST]', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
