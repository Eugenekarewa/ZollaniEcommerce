import { getTestimonials } from '@/sanity/lib/queries';
import Reveal from '@/components/ui/Reveal';

export default async function Testimonials() {
  const testimonials: { name: string; role: string; company: string; quote: string; rating: number; initials: string }[] = await getTestimonials();
  return (
    <section className="bg-gray-50 py-20">
      <div className="container-wide">
        <Reveal>
          <div className="mb-12 text-center">
            <span className="section-badge">Client Feedback</span>
            <h2 className="section-title mt-4">What Our Clients Say</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Don&apos;t just take our word for it.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="card flex h-full flex-col gap-5">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <span key={idx} className="text-coral drop-shadow-[0_0_6px_rgba(246,145,124,0.5)]">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="flex-1 text-sm leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-glow-coral">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-gray-400">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
