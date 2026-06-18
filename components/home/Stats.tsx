import { stats } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-white py-12">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="group text-center">
                <p className="text-gradient text-3xl font-black tracking-tight transition-transform duration-300 group-hover:scale-110 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
