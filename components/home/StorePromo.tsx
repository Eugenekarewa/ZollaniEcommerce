import { ExternalLink, ShoppingCart, Monitor, Smartphone, Cable } from 'lucide-react';
import { siteConfig } from '@/lib/data';

const categories = [
  { label: 'Smartphones & Cases', icon: <Smartphone className="h-5 w-5" /> },
  { label: 'Computers & Accessories', icon: <Monitor className="h-5 w-5" /> },
  { label: 'Cables & Chargers', icon: <Cable className="h-5 w-5" /> },
];

export default function StorePromo() {
  return (
    <section className="bg-white py-20">
      <div className="container-wide">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-charcoal to-charcoal-light">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Copy */}
            <div className="p-10 lg:p-14">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-300">
                Shop Online
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Shop Quality Electronics
              </h2>
              <p className="mt-4 text-gray-400">
                Browse and purchase quality electronics and accessories from our online store.
                Phones, computers, cables, chargers, and more — curated and trusted.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {categories.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-coral">
                      {cat.icon}
                    </span>
                    {cat.label}
                  </div>
                ))}
              </div>

              <a
                href={siteConfig.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-10 inline-flex gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Visit the Store
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Visual */}
            <div className="flex items-center justify-center bg-white/5 p-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {['📱', '💻', '🎧', '🔌'].map((emoji, i) => (
                    <div
                      key={i}
                      className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-4xl backdrop-blur-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
