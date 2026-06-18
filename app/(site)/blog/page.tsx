import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import NewsletterForm from '@/components/blog/NewsletterForm';
import { getPosts } from '@/sanity/lib/queries';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technology insights, cybersecurity tips, maintenance guides, and business technology advice from Zollani Tech Limited.',
};

const categories = ['All', 'Cybersecurity', 'Networking', 'Maintenance', 'Business Tech', 'Company Updates'];

export default async function BlogPage() {
  const posts = await getPosts();
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
              Knowledge Hub
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Technology <span className="text-gradient-animated">Insights</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Practical technology advice, cybersecurity awareness, and business IT tips from
              the Zollani Tech team.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  cat === 'All'
                    ? 'bg-charcoal text-white shadow-glow-soft'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: { slug: string; category: string; title: string; excerpt: string; date: string; readTime: string }, i: number) => (
              <Reveal key={post.slug} delay={(i % 3) * 100}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card group flex h-full flex-col gap-4"
                >
                  {/* Thumbnail placeholder */}
                  <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-coral-50 to-teal-50">
                    <span className="text-4xl opacity-30 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">📝</span>
                  </div>

                  <div className="flex-1">
                    <span className="section-badge">{post.category}</span>
                    <h2 className="mt-2 font-bold text-charcoal transition-colors group-hover:text-coral">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{post.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-KE', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </time>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-white py-16">
        <div className="container-wide">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-charcoal p-10 text-center">
              <div className="glow-orb -left-10 -top-10 h-40 w-40 bg-coral/20" />
              <div className="glow-orb -bottom-10 -right-10 h-40 w-40 bg-teal/20" />
              <div className="relative">
                <h2 className="text-2xl font-black text-white">
                  Stay Updated
                </h2>
                <p className="mx-auto mt-2 max-w-md text-gray-400">
                  Get technology insights and cybersecurity tips delivered to your inbox.
                </p>
                <div className="mt-6">
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
