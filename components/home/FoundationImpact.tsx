import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { foundationStats } from '@/lib/data';

export default function FoundationImpact() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />

      <div className="container-wide relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Community Impact
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Zollani Tech Foundation
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Beyond business — we invest in the next generation of African technologists through
            youth training, digital literacy programs, and community technology initiatives.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {foundationStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-gradient text-3xl font-black">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link href="/foundation" className="btn-secondary mt-10 inline-flex gap-2">
            Learn About Our Foundation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
