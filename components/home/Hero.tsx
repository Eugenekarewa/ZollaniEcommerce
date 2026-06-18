import Link from 'next/link';
import { ArrowRight, ExternalLink, ShieldCheck, Zap, Users } from 'lucide-react';
import { siteConfig } from '@/lib/data';

const trustBadges = [
  { icon: <ShieldCheck className="h-4 w-4" />, text: 'Certified Technicians' },
  { icon: <Zap className="h-4 w-4" />,         text: 'Same-Day Response' },
  { icon: <Users className="h-4 w-4" />,       text: '150+ Happy Clients' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      <div className="glow-orb -left-32 -top-32 h-96 w-96 animate-float bg-coral/25" />
      <div className="glow-orb -bottom-32 -right-32 h-96 w-96 animate-float bg-teal/25 [animation-delay:1.5s]" />
      <div className="glow-orb left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 animate-pulse-glow bg-coral/10" />

      <div className="container-wide relative py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">

          {/* Top badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 shadow-glow-soft backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-coral shadow-glow-coral" />
            Proudly Kenyan · Serving Businesses Across East Africa
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Powering Technology.{' '}
            <span className="text-gradient-animated">Enabling Growth.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            {siteConfig.description}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary gap-2 py-3.5 text-base">
              Request Service
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={siteConfig.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline gap-2 py-3.5 text-base"
            >
              Visit Our Store
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-coral/30 hover:bg-white/10 hover:text-white"
              >
                <span className="text-coral">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
