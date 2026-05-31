import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Zollani Tech Limited — our story, mission, vision, values, and the team behind professional technology solutions in Kenya.',
};

const values = [
  { title: 'Excellence',         desc: 'We pursue the highest standards in every service we provide.', icon: '🏆' },
  { title: 'Integrity',          desc: 'We operate honestly, transparently, and ethically.', icon: '🤝' },
  { title: 'Innovation',         desc: 'We embrace technology and continuous improvement.', icon: '💡' },
  { title: 'Reliability',        desc: 'Clients can depend on us to deliver consistent results.', icon: '🔒' },
  { title: 'Customer Success',   desc: 'Our success is measured by the success of our clients.', icon: '⭐' },
  { title: 'Community Impact',   desc: 'We use technology to create opportunities and positive change.', icon: '🌍' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal py-20">
        <div className="container-wide text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Our Story
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            About Zollani Tech Limited
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            A Kenyan technology company on a mission to make professional IT services accessible
            to every business, institution, and individual.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <span className="section-badge">Company Story</span>
            <h2 className="section-title mt-4">Built on a simple belief.</h2>
            <div className="mt-6 space-y-4 text-gray-600">
              <p className="text-lg leading-relaxed">
                Zollani Tech Limited was founded with a clear purpose: to bridge the gap between
                quality technology services and the organizations that need them most. Too many
                Kenyan businesses were operating with underperforming, unreliable technology 
                not because they didn&apos;t care, but because professional IT support was either
                unavailable or unaffordable.
              </p>
              <p className="leading-relaxed">
                We started by solving real problems for real people by repairing devices, setting up
                networks, and helping small businesses get the most out of their technology
                investments. With every project, we built trust, expertise, and a reputation for
                delivering results.
              </p>
              <p className="leading-relaxed">
                Today, we serve businesses, educational institutions, NGOs, and government
                organizations across Kenya. Our team of certified technicians and consultants
                brings the same commitment to every engagement — whether it&apos;s a laptop repair
                or a full network infrastructure project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-coral-100 bg-coral-50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral text-2xl text-white">
                🎯
              </div>
              <h2 className="text-xl font-black text-charcoal">Our Mission</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                To deliver professional technology solutions that help organizations and individuals
                maximize the value of their technology while creating opportunities for education,
                innovation, and community development.
              </p>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal text-2xl text-white">
                🌍
              </div>
              <h2 className="text-xl font-black text-charcoal">Our Vision</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                To become Africa&apos;s most trusted technology solutions provider, empowering
                businesses, institutions, and communities through innovative, reliable, and
                accessible technology services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <span className="section-badge">What We Stand For</span>
            <h2 className="section-title mt-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-4 font-bold text-charcoal">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Profile CTA */}
      <section className="bg-gray-50 py-20">
        <div className="container-wide">
          <div className="rounded-2xl bg-charcoal p-10 text-center">
            <h2 className="text-2xl font-black text-white">
              Need a Company Profile?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              Download our company profile for a comprehensive overview of our services,
              certifications, and case studies.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/documents/zollani-tech-company-profile.pdf"
                className="btn-primary gap-2"
              >
                Download Company Profile
              </a>
              <Link href="/contact" className="btn-outline gap-2">
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
