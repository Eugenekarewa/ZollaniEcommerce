import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Zollani Tech Limited. Request a quote, book a consultation, or reach us by phone, email, or WhatsApp.',
};

const contactMethods = [
  {
    icon: <Phone className="h-6 w-6" />,
    label: 'Phone',
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone}`,
    desc: 'Mon–Fri, 8am–6pm EAT',
    color: 'coral',
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    label: 'WhatsApp',
    value: 'Chat with us',
    href: `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`,
    desc: 'Quick responses for urgent queries',
    color: 'teal',
  },
  {
    icon: <Mail className="h-6 w-6" />,
    label: 'Email',
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    desc: 'We reply within 24 hours',
    color: 'coral',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    label: 'Location',
    value: siteConfig.address,
    href: 'https://maps.google.com/?q=Muthaiga+Business+Centre+Thika+Road+Nairobi',
    desc: 'Visit us by appointment',
    color: 'teal',
  },
];

const serviceOptions = [
  'Electronics Repair',
  'IT Support',
  'Networking',
  'Security Solutions',
  'Technology Consulting',
  'Foundation / Community',
  'Other',
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal py-20">
        <div className="container-wide text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Get in Touch
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Let&apos;s Talk Technology
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Tell us about your technology needs. We&apos;ll get back to you with a clear plan
            and honest pricing.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">

            {/* Contact form — 3 cols */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-charcoal">Send us a message</h2>
              <p className="mt-1 text-sm text-gray-500">We respond within 24 hours on business days.</p>

              <form className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal">
                      Full Name <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Mwangi"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-colors focus:border-coral focus:ring-1 focus:ring-coral"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal">
                      Email Address <span className="text-coral">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.co.ke"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-colors focus:border-coral focus:ring-1 focus:ring-coral"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-colors focus:border-coral focus:ring-1 focus:ring-coral"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    placeholder="Your company or school"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-colors focus:border-coral focus:ring-1 focus:ring-coral"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal">
                    Service Required <span className="text-coral">*</span>
                  </label>
                  <select
                    required
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-coral focus:ring-1 focus:ring-coral"
                  >
                    <option value="">Select a service…</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal">
                    Message <span className="text-coral">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your technology needs or the issue you're experiencing…"
                    className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-colors focus:border-coral focus:ring-1 focus:ring-coral"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-3.5">
                  Send Message
                </button>

                <p className="text-center text-xs text-gray-400">
                  By submitting, you agree to our Privacy Policy. We never share your data.
                </p>
              </form>
            </div>

            {/* Contact info — 2 cols */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-charcoal">Other ways to reach us</h2>
              <p className="mt-1 text-sm text-gray-500">Pick the channel that works best for you.</p>

              <div className="mt-8 space-y-4">
                {contactMethods.map((method) => (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-sm ${
                      method.color === 'coral'
                        ? 'border-coral-100 hover:border-coral-200'
                        : 'border-teal-100 hover:border-teal-200'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        method.color === 'coral' ? 'bg-coral-50 text-coral' : 'bg-teal-50 text-teal'
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        {method.label}
                      </p>
                      <p className="mt-0.5 font-semibold text-charcoal">{method.value}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{method.desc}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100">
                <div className="flex h-48 items-center justify-center bg-gray-50">
                  <div className="text-center text-sm text-gray-400">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-coral" />
                    <p className="font-medium">Nairobi, Kenya</p>
                    <a
                      href="https://maps.google.com/?q=Nairobi+Kenya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-xs text-coral underline underline-offset-2"
                    >
                      Muthaiga Business Centre, Thika Road →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
