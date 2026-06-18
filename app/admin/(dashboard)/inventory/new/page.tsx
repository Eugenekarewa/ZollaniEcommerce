import NewItemForm from './NewItemForm';

export default function NewInventoryItemPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-black text-charcoal">Add Inventory Item</h1>
      <NewItemForm />
    </div>
  );
}
