import ImportForm from './ImportForm';

export default function ImportCustomersPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Import Customers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload your Excel or CSV sheet of customers — paid and unpaid. Each row becomes a
          customer record and an invoice (marked paid or outstanding), so your existing data
          flows straight into reports and reminders.
        </p>
      </div>
      <ImportForm />
    </div>
  );
}
