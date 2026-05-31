'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import { services, siteConfig } from '@/lib/data';

const navLinks = [
  { label: 'Home',       href: '/' },
  { label: 'About',      href: '/about' },
  { label: 'Portfolio',  href: '/portfolio' },
  { label: 'Foundation', href: '/foundation' },
  { label: 'Blog',       href: '/blog' },
  { label: 'Contact',    href: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-charcoal">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-black text-white">
              Z
            </div>
            <span className="hidden text-sm font-semibold sm:block">
              Zollani Tech<span className="text-coral"> Limited</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
              Home
            </Link>
            <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
              About
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                  <Link
                    href="/services"
                    className="mb-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-coral-50 to-teal-50 px-3 py-2.5 text-sm font-semibold text-charcoal"
                  >
                    View All Services
                    <span className="text-xs text-gray-400">{services.length} services →</span>
                  </Link>
                  <div className="max-h-72 overflow-y-auto">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal"
                      >
                        <span className="shrink-0">{s.icon}</span>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/portfolio" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
              Portfolio
            </Link>
            <Link href="/foundation" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
              Foundation
            </Link>
            <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
              Blog
            </Link>
            <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-charcoal">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={siteConfig.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-charcoal transition-all hover:border-gray-300 hover:shadow-sm"
            >
              Visit Store
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link href="/contact" className="btn-primary py-2 text-sm">
              Request Service
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-2 text-gray-600 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="container-wide py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-gray-100 pt-3">
                <div className="mb-2 flex items-center justify-between px-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Services
                  </p>
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="text-xs font-medium text-coral"
                  >
                    View all →
                  </Link>
                </div>
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <span>{s.icon}</span>
                    {s.title}
                  </Link>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <a
                  href={siteConfig.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full justify-center"
                >
                  Visit Store
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">
                  Request Service
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
