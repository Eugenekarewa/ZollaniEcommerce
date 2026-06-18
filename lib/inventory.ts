export const INVENTORY_CATEGORIES = [
  'Screens',
  'RAM',
  'Batteries',
  'Storage',
  'Chargers',
  'Cables',
  'Keyboards',
  'Other',
];

export function isLowStock(item: { quantity: number; reorderLevel: number }) {
  return item.quantity <= item.reorderLevel;
}
