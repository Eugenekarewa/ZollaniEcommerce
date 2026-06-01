import { client } from './client';
import { blogPosts, featuredProjects, testimonials } from '@/lib/data';

const sanityConfigured = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id';

// ── Blog posts ───────────────────────────────────────────────────────────────

const POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    "date": publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 200) + " min read"
  }
`;

const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    body,
    "date": publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 200) + " min read",
    "coverImage": coverImage.asset->url
  }
`;

export async function getPosts() {
  if (!sanityConfigured) return blogPosts;
  try {
    return await client.fetch(POSTS_QUERY);
  } catch {
    return blogPosts;
  }
}

export async function getPostBySlug(slug: string) {
  if (!sanityConfigured) return blogPosts.find((p) => p.slug === slug) ?? null;
  try {
    return await client.fetch(POST_BY_SLUG_QUERY, { slug });
  } catch {
    return blogPosts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  if (!sanityConfigured) return blogPosts.map((p) => ({ slug: p.slug }));
  try {
    return await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  } catch {
    return blogPosts.map((p) => ({ slug: p.slug }));
  }
}

// ── Portfolio projects ───────────────────────────────────────────────────────

const PROJECTS_QUERY = `
  *[_type == "project"] | order(completedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    client,
    description,
    outcome,
    tags,
    "images": images[].asset->url
  }
`;

export async function getProjects() {
  if (!sanityConfigured) return featuredProjects;
  try {
    return await client.fetch(PROJECTS_QUERY);
  } catch {
    return featuredProjects;
  }
}

// ── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && featured == true] | order(_createdAt asc) {
    _id,
    name,
    role,
    company,
    quote,
    rating,
    "avatar": avatar.asset->url,
    "initials": string::split(name, " ")[0][0] + string::split(name, " ")[-1][0]
  }
`;

export async function getTestimonials() {
  if (!sanityConfigured) return testimonials;
  try {
    return await client.fetch(TESTIMONIALS_QUERY);
  } catch {
    return testimonials;
  }
}
