// WhatsApp messaging via Twilio. Requires a Twilio account with WhatsApp
// enabled (sandbox for testing, or an approved WhatsApp Business sender for
// production). Gracefully no-ops if Twilio isn't configured, so the rest of
// the app keeps working without it.
//
// Required env vars:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_WHATSAPP_FROM   e.g. "whatsapp:+14155238886" (Twilio sandbox number)

function isConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM
  );
}

function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');
  // Kenyan numbers are often stored as 07... — normalize to +254 E.164
  const e164 = digits.startsWith('254') ? `+${digits}` : digits.startsWith('0') ? `+254${digits.slice(1)}` : `+${digits}`;
  return `whatsapp:${e164}`;
}

export async function sendWhatsApp(params: { to: string; body: string }) {
  if (!isConfigured()) {
    console.log('[whatsapp] Twilio not configured — skipping WhatsApp send. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM to enable.');
    return { sent: false, reason: 'not_configured' as const };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_WHATSAPP_FROM!;

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: from,
      To: toWhatsAppNumber(params.to),
      Body: params.body,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[whatsapp] Twilio send failed:', data);
    return { sent: false, reason: 'twilio_error' as const, error: data };
  }

  return { sent: true as const, sid: data.sid };
}
