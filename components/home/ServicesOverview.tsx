import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/lib/data';

export default function ServicesOverview() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="section-badge">What We Do</span>
          <h2 className="section-title mt-4">Our Services</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            From hardware repairs to strategic technology consulting — we cover every aspect of your
            technology needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group card flex flex-col gap-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                  service.color === 'coral'
                    ? 'bg-coral-50 text-coral'
                    : 'bg-teal-50 text-teal'
                }`}
              >
                {service.icon}
              </div>
              <div>
                <h3 className="font-bold text-charcoal">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {service.shortDesc}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-coral transition-all group-hover:gap-2">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
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
