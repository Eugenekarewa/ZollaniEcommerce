import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

export default function ServicesOverview() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container-wide">
        {/* Header */}
        <Reveal>
          <div className="mb-12 text-center">
            <span className="section-badge">What We Do</span>
            <h2 className="section-title mt-4">Our Services</h2>
            <p className="section-subtitle mx-auto max-w-2xl">
              From hardware repairs to strategic technology consulting — we cover every aspect of your
              technology needs.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 100}>
              <Link
                href={`/services/${service.slug}`}
                className="group card flex h-full flex-col gap-4"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    service.color === 'coral'
                      ? 'bg-coral-50 text-coral shadow-[0_0_0_1px_rgba(246,145,124,0.1)] group-hover:shadow-glow-coral'
                      : 'bg-teal-50 text-teal shadow-[0_0_0_1px_rgba(77,145,144,0.1)] group-hover:shadow-glow-teal'
                  }`}
                >
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal transition-colors group-hover:text-coral">{service.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {service.shortDesc}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-coral transition-all group-hover:gap-2">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="btn-ghost">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
