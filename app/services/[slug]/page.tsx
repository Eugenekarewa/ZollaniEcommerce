import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { services } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal py-16">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className={`glow-orb -left-20 -top-20 h-64 w-64 animate-float ${service.color === 'coral' ? 'bg-coral/25' : 'bg-teal/25'}`} />
        <div className="container-wide relative">
          <Reveal>
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All Services
            </Link>
            <div className="flex items-start gap-6">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl transition-transform duration-300 hover:scale-110 hover:rotate-3 ${
                  service.color === 'coral' ? 'bg-coral/20 shadow-glow-coral' : 'bg-teal/20 shadow-glow-teal'
                }`}
              >
                {service.icon}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {service.title}
                </h1>
                <p className="mt-2 max-w-xl text-gray-400">{service.shortDesc}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-white py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.subServices.map((sub, i) => (
              <Reveal key={sub.title} delay={(i % 3) * 80}>
                <div className="group card h-full">
                  <CheckCircle2 className="h-6 w-6 text-coral transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mt-3 font-bold text-charcoal">{sub.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{sub.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us for this service */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="section-title">Why choose Zollani Tech for {service.title}?</h2>
              <p className="section-subtitle">
                Our certified team delivers {service.title.toLowerCase()} services that meet
                international standards while understanding the local Kenyan context.
              </p>
              <Link href="/contact" className="btn-primary mt-8 inline-flex gap-2">
                Request This Service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Other services */}
      {otherServices.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-wide">
            <Reveal>
              <h2 className="mb-8 text-xl font-bold text-charcoal">Other Services</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {otherServices.map((s, i) => (
                <Reveal key={s.slug} delay={i * 80}>
                  <Link href={`/services/${s.slug}`} className="card group flex h-full items-start gap-3">
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{s.icon}</span>
                    <div>
                      <p className="font-semibold text-charcoal transition-colors group-hover:text-coral">{s.title}</p>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{s.shortDesc}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
