import { whyChooseUs } from '@/lib/data';

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left copy */}
          <div>
            <span className="section-badge">Why Zollani Tech</span>
            <h2 className="section-title mt-4">
              Technology partner you can count on.
            </h2>
            <p className="section-subtitle">
              We don&apos;t just fix problems — we build lasting relationships. Here&apos;s why
              over 150 organizations trust Zollani Tech as their technology partner.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-xl">
                  🇰🇪
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Proudly Kenyan</p>
                  <p className="text-xs text-gray-500">Local knowledge, global standards</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-xl">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Industry Certifications</p>
                  <p className="text-xs text-gray-500">Certified in networking, hardware, and security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all hover:border-coral-200 hover:bg-coral-50/30"
              >
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-charcoal">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
