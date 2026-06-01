import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import {
  resend,
  contactNotificationEmail,
  contactConfirmationEmail,
} from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Store in database
    await db.contactSubmission.create({
      data: {
        name:    data.name,
        email:   data.email,
        phone:   data.phone,
        company: data.company,
        service: data.service,
        message: data.message,
      },
    });

    // Send emails (don't block the response if email fails)
    const emailPromises = [
      resend().emails.send(contactNotificationEmail(data)),
      resend().emails.send(contactConfirmationEmail({
        name:    data.name,
        email:   data.email,
        service: data.service,
      })),
    ];

    await Promise.allSettled(emailPromises);

    return NextResponse.json(
      { success: true, message: 'Your message has been received. We\'ll be in touch within 24 hours.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[contact/POST]', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try WhatsApp or call us directly.' },
      { status: 500 }
    );
  }
}
