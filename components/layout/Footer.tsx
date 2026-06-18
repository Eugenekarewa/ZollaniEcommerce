import Link from 'next/link';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram, ExternalLink } from 'lucide-react';
import { siteConfig, services } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-gray-300">
      <div className="glow-orb -left-32 -top-32 h-72 w-72 bg-coral/20" />
      <div className="glow-orb -bottom-32 -right-32 h-72 w-72 bg-teal/20" />

      <div className="container-wide relative py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="group mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-base font-black text-white shadow-glow-coral transition-transform duration-300 group-hover:scale-110">
                Z
              </div>
              <span className="font-bold text-white">
                Zollani Tech <span className="text-coral">Limited</span>
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Professional technology solutions for businesses, institutions, and individuals across Kenya.
            </p>
            <div className="flex gap-3">
              {[
                { href: siteConfig.social.twitter,   icon: <Twitter className="h-4 w-4" />,   label: 'Twitter' },
                { href: siteConfig.social.linkedin,  icon: <Linkedin className="h-4 w-4" />,  label: 'LinkedIn' },
                { href: siteConfig.social.facebook,  icon: <Facebook className="h-4 w-4" />,  label: 'Facebook' },
                { href: siteConfig.social.instagram, icon: <Instagram className="h-4 w-4" />, label: 'Instagram' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral hover:text-white hover:shadow-glow-coral"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-sm font-medium text-coral transition-colors hover:text-coral-300">
                  All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us',       href: '/about' },
                { label: 'Portfolio',      href: '/portfolio' },
                { label: 'Blog',           href: '/blog' },
                { label: 'Foundation',     href: '/foundation' },
                { label: 'Contact',        href: '/contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Online Store
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-start gap-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <span className="text-coral">💬</span>
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                {siteConfig.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Zollani Tech Limited. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
