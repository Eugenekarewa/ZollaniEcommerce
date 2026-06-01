import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { stats } from '@/lib/data';
import { getProjects } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Browse Zollani Tech Limited case studies, completed projects, and client success stories across Kenya.',
};

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal py-20">
        <div className="container-wide text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Our Work
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Projects & Case Studies
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Real projects. Real results. See how we&apos;ve helped organizations across Kenya
            transform their technology.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-white py-10">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-gradient text-3xl font-black">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-gray-50 py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: { slug: string; title: string; category: string; client: string; description: string; outcome: string; tags: string[] }) => (
              <div key={project.slug} className="card flex flex-col gap-4">
                <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-coral-50 to-teal-50">
                  <span className="text-5xl opacity-30">🖥️</span>
                </div>

                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal">
                    {project.category}
                  </span>
                  <h2 className="mt-2 font-bold text-charcoal">{project.title}</h2>
                  <p className="mt-0.5 text-xs text-gray-400">{project.client}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{project.description}</p>
                </div>

                <div className="rounded-xl bg-coral-50 p-3">
                  <p className="text-xs font-semibold text-coral-700">
                    Result: {project.outcome}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container-wide text-center">
          <h2 className="section-title">Want similar results for your organization?</h2>
          <p className="section-subtitle">Let&apos;s discuss your technology challenges.</p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex gap-2">
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
