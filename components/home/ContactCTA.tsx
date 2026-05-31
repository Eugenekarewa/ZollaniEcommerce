import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="bg-white py-20">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-8 py-16 text-center sm:px-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />

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
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-charcoal shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=consultation"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Calendar className="h-4 w-4" />
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
