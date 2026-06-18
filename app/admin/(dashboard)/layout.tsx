import Link from 'next/link';
import { LayoutDashboard, Inbox, Receipt, Users, Package, Wallet, BarChart3, PlusCircle, LogOut } from 'lucide-react';

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
          <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <BarChart3 className="h-4 w-4" /> Analytics
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
          <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Package className="h-4 w-4" /> Inventory
          </Link>
          <Link href="/admin/expenses" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Wallet className="h-4 w-4" /> Expenses
          </Link>

          <div className="pt-3 mt-3 border-t border-gray-700">
            <Link href="/admin/payments/new" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-coral/15 text-coral hover:bg-coral/25 transition-colors font-medium">
              <PlusCircle className="h-4 w-4" /> Record Payment
            </Link>
          </div>
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
