import Link from 'next/link';
import { featuredProjects } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

export default function FeaturedProjects() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-badge">Recent Work</span>
              <h2 className="section-title mt-4">Featured Projects</h2>
              <p className="section-subtitle max-w-xl">
                Real results for real clients across Kenya.
              </p>
            </div>
            <Link href="/portfolio" className="btn-ghost shrink-0 self-start sm:self-auto">
              View All Projects
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 100}>
              <div className="group card flex h-full flex-col gap-4">
                {/* Placeholder image */}
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-coral-50 to-teal-50">
                  <span className="text-4xl opacity-40 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">🖥️</span>
                </div>

                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal">
                    {project.category}
                  </span>
                  <h3 className="mt-2 font-bold text-charcoal transition-colors group-hover:text-coral">{project.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{project.client}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{project.description}</p>
                </div>

                {/* Outcome callout */}
                <div className="flex items-start gap-2 rounded-xl bg-coral-50 p-3 transition-colors duration-300 group-hover:bg-coral-100">
                  <span className="mt-0.5 text-coral">✓</span>
                  <p className="text-xs font-medium text-coral-700">{project.outcome}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500 transition-colors group-hover:border-coral-200 group-hover:text-coral"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
