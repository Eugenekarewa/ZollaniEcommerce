import { stats } from '@/lib/data';

export default function Stats() {
  return (
    <section className="border-b border-gray-100 bg-white py-12">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-gradient text-3xl font-black tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
