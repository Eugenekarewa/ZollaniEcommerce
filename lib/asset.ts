export const ASSET_CATEGORIES = ['Equipment', 'Tools', 'Vehicle', 'Furniture', 'Electronics', 'Other'];

export type AssetLike = {
  purchaseCost: number;
  purchaseDate: Date;
  usefulLifeYears: number;
  salvageValue: number;
  disposed: boolean;
  disposedAt: Date | null;
};

function monthsBetween(start: Date, end: Date): number {
  if (end <= start) return 0;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

/** Straight-line depreciation: equal monthly write-down from purchaseCost down
 * to salvageValue over usefulLifeYears. Stops accruing at disposal (if any). */
export function depreciate(asset: AssetLike, asOfDate: Date = new Date()) {
  const effectiveDate = asset.disposed && asset.disposedAt
    ? (asOfDate < asset.disposedAt ? asOfDate : asset.disposedAt)
    : asOfDate;

  const depreciableBase = Math.max(0, asset.purchaseCost - asset.salvageValue);
  const totalMonths = Math.max(1, asset.usefulLifeYears * 12);
  const monthlyDepreciation = depreciableBase / totalMonths;

  const monthsElapsed = monthsBetween(asset.purchaseDate, effectiveDate);
  const accumulatedDepreciation = Math.min(depreciableBase, Math.round(monthlyDepreciation * monthsElapsed));
  const bookValue = Math.max(asset.salvageValue, asset.purchaseCost - accumulatedDepreciation);

  return { accumulatedDepreciation, bookValue, monthlyDepreciation: Math.round(monthlyDepreciation) };
}
