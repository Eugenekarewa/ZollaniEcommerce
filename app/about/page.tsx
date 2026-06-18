import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

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
      <section className="relative overflow-hidden bg-charcoal py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="glow-orb -left-24 -top-24 h-72 w-72 animate-float bg-coral/20" />
        <div className="glow-orb -bottom-24 -right-24 h-72 w-72 animate-float bg-teal/20 [animation-delay:1.5s]" />
        <div className="container-wide relative text-center">
          <Reveal>
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400 backdrop-blur-sm">
              Our Story
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              About <span className="text-gradient-animated">Zollani Tech</span> Limited
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              A Kenyan technology company on a mission to make professional IT services accessible
              to every business, institution, and individual.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <Reveal>
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
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Reveal>
              <div className="group h-full rounded-2xl border border-coral-100 bg-coral-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-coral">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral text-2xl text-white shadow-glow-coral transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  🎯
                </div>
                <h2 className="text-xl font-black text-charcoal">Our Mission</h2>
                <p className="mt-3 leading-relaxed text-gray-600">
                  To deliver professional technology solutions that help organizations and individuals
                  maximize the value of their technology while creating opportunities for education,
                  innovation, and community development.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="group h-full rounded-2xl border border-teal-100 bg-teal-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-teal">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal text-2xl text-white shadow-glow-teal transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  🌍
                </div>
                <h2 className="text-xl font-black text-charcoal">Our Vision</h2>
                <p className="mt-3 leading-relaxed text-gray-600">
                  To become Africa&apos;s most trusted technology solutions provider, empowering
                  businesses, institutions, and communities through innovative, reliable, and
                  accessible technology services.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="section-badge">What We Stand For</span>
              <h2 className="section-title mt-4">Our Core Values</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 100}>
                <div className="group card h-full">
                  <span className="inline-block text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{v.icon}</span>
                  <h3 className="mt-4 font-bold text-charcoal">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Company Profile CTA */}
      <section className="bg-gray-50 py-20">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-charcoal p-10 text-center">
              <div className="glow-orb -left-10 -top-10 h-40 w-40 bg-coral/20" />
              <div className="glow-orb -bottom-10 -right-10 h-40 w-40 bg-teal/20" />
              <div className="relative">
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
                    download="Zollani Tech Company Profile.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
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
          </Reveal>
        </div>
      </section>
    </>
  );
}
