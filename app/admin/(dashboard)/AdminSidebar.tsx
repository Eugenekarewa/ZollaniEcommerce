'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Inbox, Receipt, Users, Package, Wallet, BarChart3,
  PlusCircle, LogOut, Menu, X, Settings,
} from 'lucide-react';

const navLinks = [
  { href: '/admin',           label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics',       icon: BarChart3 },
  { href: '/admin/customers', label: 'Customers',       icon: Users },
  { href: '/admin/requests',  label: 'Service Requests', icon: Inbox },
  { href: '/admin/invoices',  label: 'Invoices',        icon: Receipt },
  { href: '/admin/inventory', label: 'Inventory',       icon: Package },
  { href: '/admin/expenses',  label: 'Expenses',        icon: Wallet },
  { href: '/admin/settings',  label: 'Settings',        icon: Settings },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <header className="flex items-center justify-between bg-charcoal px-4 py-3 text-white lg:hidden">
        <span className="text-base font-black">
          <span className="text-gradient">Zollani</span> Admin
        </span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1.5">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static column on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-charcoal text-white flex flex-col transition-transform duration-300 lg:static lg:z-auto lg:w-56 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div>
            <span className="text-lg font-black text-gradient">Zollani</span>
            <span className="text-lg font-black"> Admin</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-sm">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  active ? 'bg-coral/15 text-coral' : 'hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" /> {label}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-gray-700">
            <Link
              href="/admin/payments/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-coral/15 text-coral hover:bg-coral/25 transition-colors font-medium"
            >
              <PlusCircle className="h-4 w-4 shrink-0" /> Record Payment
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white w-full rounded-xl hover:bg-white/10 transition-colors">
              <LogOut className="h-4 w-4 shrink-0" /> Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
