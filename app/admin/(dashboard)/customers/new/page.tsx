import NewCustomerForm from './NewCustomerForm';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-black text-charcoal">Add Customer</h1>
      <NewCustomerForm />
    </div>
  );
}
