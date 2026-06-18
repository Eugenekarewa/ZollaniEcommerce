import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/data';
import ContactForm from '@/components/contact/ContactForm';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Zollani Tech. Request a quote, book a consultation, or reach us by phone, email, or WhatsApp in Nairobi.',
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
    value: 'Muthaiga Business Centre',
    href: 'https://maps.google.com/?q=Muthaiga+Business+Centre+Thika+Road+Nairobi',
    desc: 'Thika Road, Former Shell Petrol Station',
    color: 'teal',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="glow-orb -left-24 -top-24 h-72 w-72 animate-float bg-coral/20" />
        <div className="glow-orb -bottom-24 -right-24 h-72 w-72 animate-float bg-teal/20 [animation-delay:1.5s]" />
        <div className="container-wide relative text-center">
          <Reveal>
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400 backdrop-blur-sm">
              Get in Touch
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Let&apos;s Talk <span className="text-gradient-animated">Technology</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Tell us about your technology needs. We&apos;ll get back to you within 24 hours
              with a clear plan and honest pricing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">

            {/* Contact form — 3 cols */}
            <Reveal className="lg:col-span-3">
              <h2 className="text-xl font-bold text-charcoal">Send us a message</h2>
              <p className="mt-1 text-sm text-gray-500">
                We respond within 24 hours on business days.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>

            {/* Contact info — 2 cols */}
            <Reveal delay={150} className="lg:col-span-2">
              <h2 className="text-xl font-bold text-charcoal">Other ways to reach us</h2>
              <p className="mt-1 text-sm text-gray-500">
                Pick the channel that works best for you.
              </p>

              <div className="mt-8 space-y-4">
                {contactMethods.map((method) => (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                      method.color === 'coral'
                        ? 'border-coral-100 hover:border-coral-200 hover:shadow-glow-coral'
                        : 'border-teal-100 hover:border-teal-200 hover:shadow-glow-teal'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                        method.color === 'coral'
                          ? 'bg-coral-50 text-coral'
                          : 'bg-teal-50 text-teal'
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
              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-glow-soft">
                <div className="flex h-48 items-center justify-center bg-gray-50">
                  <div className="text-center text-sm text-gray-400">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-coral" />
                    <p className="font-medium text-charcoal">Muthaiga Business Centre</p>
                    <p className="text-xs">Thika Road, Former Shell Petrol Station</p>
                    <a
                      href="https://maps.google.com/?q=Muthaiga+Business+Centre+Thika+Road+Nairobi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-xs text-coral underline underline-offset-2"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
