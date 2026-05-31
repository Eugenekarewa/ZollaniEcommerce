import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technology insights, cybersecurity tips, maintenance guides, and business technology advice from Zollani Tech Limited.',
};

const categories = ['All', 'Cybersecurity', 'Networking', 'Maintenance', 'Business Tech', 'Company Updates'];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal py-20">
        <div className="container-wide text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Knowledge Hub
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Technology Insights
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Practical technology advice, cybersecurity awareness, and business IT tips from
            the Zollani Tech team.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  cat === 'All'
                    ? 'bg-charcoal text-white'
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
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group flex flex-col gap-4"
              >
                {/* Thumbnail placeholder */}
                <div className="flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-coral-50 to-teal-50">
                  <span className="text-4xl opacity-30">📝</span>
                </div>

                <div className="flex-1">
                  <span className="section-badge">{post.category}</span>
                  <h2 className="mt-2 font-bold text-charcoal group-hover:text-coral transition-colors">
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
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-white py-16">
        <div className="container-wide">
          <div className="rounded-2xl bg-charcoal p-10 text-center">
            <h2 className="text-2xl font-black text-white">
              Stay Updated
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-400">
              Get technology insights and cybersecurity tips delivered to your inbox.
            </p>
            <form className="mx-auto mt-6 flex max-w-sm gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50"
              />
              <button type="submit" className="btn-primary shrink-0 py-3">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
