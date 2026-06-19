import Link from 'next/link';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { depreciate } from '@/lib/asset';
import AddAssetForm from './AddAssetForm';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
  const assets = await db.asset.findMany({ orderBy: { purchaseDate: 'desc' } });

  const owned = assets.filter((a) => !a.disposed);
  const disposed = assets.filter((a) => a.disposed);

  let grossCost = 0;
  let netBookValue = 0;
  let accumulatedDepreciation = 0;
  for (const a of owned) {
    const { accumulatedDepreciation: accum, bookValue } = depreciate(a);
    grossCost += a.purchaseCost;
    netBookValue += bookValue;
    accumulatedDepreciation += accum;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Business Assets</h1>
        <p className="text-gray-500 text-sm mt-1">Equipment, tools, and other property the business owns</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Assets Owned</p>
          <p className="text-2xl font-black text-charcoal">{owned.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Purchase Cost</p>
          <p className="text-2xl font-black text-charcoal">{formatPrice(grossCost)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Accumulated Depreciation</p>
          <p className="text-2xl font-black text-gray-500">{formatPrice(accumulatedDepreciation)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Current Book Value</p>
          <p className="text-2xl font-black text-teal">{formatPrice(netBookValue)}</p>
        </div>
      </div>

      <AddAssetForm />

      {owned.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">No assets recorded yet.</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Purchased</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Book Value</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {owned.map((a) => {
                  const { bookValue } = depreciate(a);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/assets/${a.id}`} className="font-medium text-charcoal hover:text-coral">{a.name}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs text-teal">{a.category}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{a.purchaseDate.toLocaleDateString('en-KE')}</td>
                      <td className="px-4 py-3 text-gray-500">{formatPrice(a.purchaseCost)}</td>
                      <td className="px-4 py-3 font-medium text-charcoal">{formatPrice(bookValue)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/assets/${a.id}`} className="text-coral hover:underline text-xs font-medium">Manage</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {disposed.length > 0 && (
        <div className="card overflow-hidden p-0">
          <h2 className="font-bold text-charcoal px-4 pt-4">Disposed Assets ({disposed.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Disposed</th>
                  <th className="px-4 py-3">Proceeds</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {disposed.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 text-gray-400">
                    <td className="px-4 py-3"><Link href={`/admin/assets/${a.id}`} className="hover:text-coral">{a.name}</Link></td>
                    <td className="px-4 py-3">{formatPrice(a.purchaseCost)}</td>
                    <td className="px-4 py-3">{a.disposedAt?.toLocaleDateString('en-KE') ?? '—'}</td>
                    <td className="px-4 py-3">{a.disposalValue != null ? formatPrice(a.disposalValue) : '—'}</td>
                    <td className="px-4 py-3"><Link href={`/admin/assets/${a.id}`} className="text-coral hover:underline text-xs font-medium">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
