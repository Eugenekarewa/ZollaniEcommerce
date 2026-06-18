import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function ContactCTA() {
  return (
    <section className="bg-white py-20">
      <div className="container-wide">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand bg-200% px-8 py-16 text-center shadow-glow-coral animate-gradient-pan sm:px-16">
            {/* Decorative circles */}
            <div className="glow-orb -left-10 -top-10 h-40 w-40 animate-float bg-white/10" />
            <div className="glow-orb -bottom-10 -right-10 h-40 w-40 animate-float bg-white/10 [animation-delay:1.5s]" />

            <h2 className="relative text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Technology?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/80">
              Tell us about your technology challenges and we&apos;ll craft a solution tailored to
              your needs and budget.
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-charcoal shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact?type=consultation"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <Calendar className="h-4 w-4" />
                Book a Consultation
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
