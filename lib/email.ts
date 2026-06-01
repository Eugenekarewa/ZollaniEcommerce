import { Resend } from 'resend';
import { siteConfig } from './data';

// Lazy — only instantiated when actually sending an email at request time
function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'missing');
}

export { getResend as resend };

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
const REPLY_TO     = siteConfig.email;

// ── Contact form: notification to Zollani Tech ──────────────────────────────

export function contactNotificationEmail(data: {
  name:    string;
  email:   string;
  phone?:  string;
  company?: string;
  service: string;
  message: string;
}) {
  return {
    from:    FROM_ADDRESS,
    to:      [siteConfig.email],
    replyTo: data.email,
    subject: `New enquiry from ${data.name} — ${data.service}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#1F2937;padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">New Contact Form Submission</h1>
          <p style="color:#9CA3AF;margin:4px 0 0;font-size:14px;">via zollani.co.ke</p>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:600;width:120px;color:#374151;">Name</td><td style="padding:8px 0;color:#1F2937;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;color:#374151;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#F6917C;">${data.email}</a></td></tr>
            ${data.phone   ? `<tr><td style="padding:8px 0;font-weight:600;color:#374151;">Phone</td><td style="padding:8px 0;color:#1F2937;"><a href="tel:${data.phone}" style="color:#F6917C;">${data.phone}</a></td></tr>` : ''}
            ${data.company ? `<tr><td style="padding:8px 0;font-weight:600;color:#374151;">Company</td><td style="padding:8px 0;color:#1F2937;">${data.company}</td></tr>` : ''}
            <tr><td style="padding:8px 0;font-weight:600;color:#374151;">Service</td><td style="padding:8px 0;color:#1F2937;">${data.service}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#F9FAFB;border-radius:8px;border-left:4px solid #F6917C;">
            <p style="font-weight:600;margin:0 0 8px;color:#374151;">Message</p>
            <p style="margin:0;color:#1F2937;line-height:1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${data.email}?subject=Re: Your enquiry — Zollani Tech" style="background:#F6917C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Reply to ${data.name}</a>
          </div>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:16px;">Zollani Tech · Muthaiga Business Centre, Thika Road, Nairobi</p>
      </div>
    `,
  };
}

// ── Contact form: confirmation to the person who submitted ──────────────────

export function contactConfirmationEmail(data: { name: string; email: string; service: string }) {
  return {
    from:    FROM_ADDRESS,
    to:      [data.email],
    replyTo: REPLY_TO,
    subject: `We received your message — Zollani Tech`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:linear-gradient(135deg,#F6917C,#4D9190);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;">Zollani Tech</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Powering Technology. Enabling Growth.</p>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;padding:32px;border-radius:0 0 12px 12px;">
          <h2 style="color:#1F2937;margin:0 0 12px;">Hi ${data.name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px;">
            Thank you for reaching out! We've received your enquiry about <strong>${data.service}</strong>
            and our team will get back to you within <strong>24 hours</strong> on business days.
          </p>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px;">
            If you have an urgent issue, you can also reach us directly:
          </p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a href="tel:${siteConfig.phone}" style="background:#1F2937;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">📞 Call Us</a>
            <a href="https://wa.me/${siteConfig.whatsapp.replace(/\D/g,'')}" style="background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">💬 WhatsApp</a>
          </div>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:16px;">
          Zollani Tech · Thika Road, Muthaiga Business Centre · Nairobi, Kenya<br>
          <a href="https://zollani.co.ke" style="color:#F6917C;">zollani.co.ke</a>
        </p>
      </div>
    `,
  };
}

// ── Newsletter: welcome email ────────────────────────────────────────────────

export function newsletterWelcomeEmail(email: string) {
  return {
    from:    FROM_ADDRESS,
    to:      [email],
    replyTo: REPLY_TO,
    subject: `You're subscribed — Zollani Tech Newsletter`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:linear-gradient(135deg,#F6917C,#4D9190);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;">Zollani Tech</h1>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;padding:32px;border-radius:0 0 12px 12px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">✅</div>
          <h2 style="color:#1F2937;margin:0 0 12px;">You're subscribed!</h2>
          <p style="color:#374151;line-height:1.7;max-width:400px;margin:0 auto 24px;">
            You'll receive technology insights, cybersecurity tips, and business IT advice
            from the Zollani Tech team.
          </p>
          <a href="https://zollani.co.ke/blog" style="background:#F6917C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Read the Blog →</a>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:16px;">
          <a href="#" style="color:#9CA3AF;">Unsubscribe</a> · Zollani Tech · Nairobi, Kenya
        </p>
      </div>
    `,
  };
}
