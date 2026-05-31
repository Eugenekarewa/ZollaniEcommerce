import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { foundationStats, foundationPrograms } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Zollani Tech Foundation',
  description:
    'The Zollani Tech Foundation empowers youth through digital literacy, technology education, and community programs across Kenya.',
};

const partnerships = [
  { title: 'Corporate Partners', desc: 'Sponsor technology equipment, programs, or training for youth in underserved communities.' },
  { title: 'Volunteer Technologists', desc: 'Share your skills — teach, mentor, or support our training programs.' },
  { title: 'Grant Applications', desc: 'Apply for grants and resources to support technology education in your community.' },
  { title: 'NGO Collaboration', desc: 'Partner with us to deliver technology-focused community development programs.' },
];

export default function FoundationPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal py-20">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />
        <div className="container-wide relative text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/20">
            <Heart className="h-7 w-7 text-teal-300" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Zollani Tech Foundation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Beyond business. We invest in the next generation of African technologists through
            youth empowerment, digital literacy, and community technology initiatives.
          </p>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-white py-14">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {foundationStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-teal-100 bg-teal-50 p-8 text-center">
                <p className="text-4xl font-black text-teal">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-gray-50 py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <span className="section-badge">What We Do</span>
            <h2 className="section-title mt-4">Foundation Programs</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Practical technology education that opens doors and changes lives.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {foundationPrograms.map((program, i) => (
              <div key={program.title} className="card">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    i % 2 === 0 ? 'bg-coral-50 text-coral' : 'bg-teal-50 text-teal'
                  }`}
                >
                  {['🎓', '🖥️', '👩‍💻'][i]}
                </div>
                <h3 className="mt-4 font-bold text-charcoal">{program.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <span className="section-badge">Get Involved</span>
            <h2 className="section-title mt-4">Partnership Opportunities</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Join us in building a digitally empowered Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {partnerships.map((p) => (
              <div key={p.title} className="card flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{p.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact?type=foundation" className="btn-secondary inline-flex gap-2">
              Get Involved
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
