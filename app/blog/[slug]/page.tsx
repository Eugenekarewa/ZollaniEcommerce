import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="bg-white py-12">
      <div className="container-wide max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <span className="section-badge">{post.category}</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-charcoal sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-KE', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {post.readTime}
          </span>
        </div>

        <div className="mt-8 flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-50 to-teal-50">
          <span className="text-6xl opacity-30">📝</span>
        </div>

        {/* Placeholder content — replaced with Sanity Portable Text once CMS is connected */}
        <div className="mt-8 space-y-4 text-gray-600">
          <p className="text-lg">{post.excerpt}</p>
          <p>
            Full article content will appear here once connected to Sanity CMS. Add your
            article content in the Sanity Studio at{' '}
            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-charcoal">/studio</span>{' '}
            once your project is configured.
          </p>
        </div>

        <div className="mt-12 rounded-2xl bg-coral-50 p-8 text-center">
          <h2 className="font-bold text-charcoal">Need technology help?</h2>
          <p className="mt-2 text-sm text-gray-500">
            Our team is ready to help with any IT challenge.
          </p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
