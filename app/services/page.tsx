import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Electronics repair, IT support, networking, security, and technology consulting services in Kenya.',
};

export default function ServicesPage() {
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
              What We Offer
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Professional <span className="text-gradient-animated">Technology Services</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              From same-day device repairs to long-term technology partnerships — we have the
              expertise to keep your technology running at its best.
            </p>
            <Link href="/contact" className="btn-primary mt-8 inline-flex gap-2">
              Request a Service
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 2) * 100}>
                <div className="group card h-full">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                        service.color === 'coral'
                          ? 'bg-coral-50 text-coral group-hover:shadow-glow-coral'
                          : 'bg-teal-50 text-teal group-hover:shadow-glow-teal'
                      }`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-charcoal transition-colors group-hover:text-coral">{service.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">{service.shortDesc}</p>
                    </div>
                  </div>

                  {/* Sub-services */}
                  <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {service.subServices.map((sub) => (
                      <div key={sub.title} className="rounded-xl bg-gray-50 p-3 transition-colors duration-300 hover:bg-coral-50/50">
                        <p className="text-xs font-semibold text-charcoal">{sub.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{sub.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-coral transition-all hover:gap-2.5"
                  >
                    Full details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide text-center">
          <Reveal>
            <h2 className="section-title">Not sure what you need?</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Our team will assess your situation and recommend the right solution. No commitment
              required for the initial consultation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact?type=consultation" className="btn-primary">
                Book Free Consultation
              </Link>
              <Link href="/contact" className="btn-ghost">
                Get a Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
