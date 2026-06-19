import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/invoice';
import { depreciate } from '@/lib/asset';
import AssetManager from './AssetManager';

export const dynamic = 'force-dynamic';

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await db.asset.findUnique({ where: { id } });
  if (!asset) notFound();

  const { accumulatedDepreciation, bookValue, monthlyDepreciation } = depreciate(asset);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">{asset.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{asset.category} · purchased {asset.purchaseDate.toLocaleDateString('en-KE')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Current Book Value</p>
          <p className="text-2xl font-black text-teal">{formatPrice(bookValue)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Accumulated Depreciation</p>
          <p className="text-2xl font-black text-gray-500">{formatPrice(accumulatedDepreciation)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Purchase Cost</p>
          <p className="text-xl font-bold text-charcoal">{formatPrice(asset.purchaseCost)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Monthly Depreciation</p>
          <p className="text-xl font-bold text-charcoal">{formatPrice(monthlyDepreciation)}</p>
        </div>
      </div>

      {asset.disposed && (
        <div className="card border-gray-200 bg-gray-50 space-y-1">
          <p className="font-semibold text-charcoal">Disposed</p>
          <p className="text-sm text-gray-600">
            On {asset.disposedAt?.toLocaleDateString('en-KE')}
            {asset.disposalValue != null && <> for {formatPrice(asset.disposalValue)}</>}
          </p>
        </div>
      )}

      <AssetManager asset={{
        id: asset.id,
        name: asset.name,
        category: asset.category,
        purchaseCost: asset.purchaseCost,
        purchaseDate: asset.purchaseDate.toISOString().slice(0, 10),
        usefulLifeYears: asset.usefulLifeYears,
        salvageValue: asset.salvageValue,
        notes: asset.notes ?? '',
        disposed: asset.disposed,
      }} />
    </div>
  );
}
