import { industries } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

export default function Industries() {
  return (
    <section className="bg-white py-16">
      <div className="container-wide">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="section-badge">Who We Serve</span>
            <h2 className="section-title mt-4">Industries We Serve</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              From classrooms to boardrooms, we deliver technology solutions tailored to your sector.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-4">
          {industries.map((industry, i) => (
            <Reveal key={industry.name} delay={i * 60}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-coral-300 hover:shadow-glow-soft">
                <span className="text-xl">{industry.icon}</span>
                <span className="font-semibold text-charcoal">{industry.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
