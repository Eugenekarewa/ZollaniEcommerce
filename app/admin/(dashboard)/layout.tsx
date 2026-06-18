import Link from 'next/link';
import { LayoutDashboard, Inbox, Receipt, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 shrink-0 bg-charcoal text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-lg font-black text-gradient">Zollani</span>
          <span className="text-lg font-black"> Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Users className="h-4 w-4" /> Customers
          </Link>
          <Link href="/admin/requests" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Inbox className="h-4 w-4" /> Service Requests
          </Link>
          <Link href="/admin/invoices" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Receipt className="h-4 w-4" /> Invoices
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white w-full rounded-xl hover:bg-white/10 transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
