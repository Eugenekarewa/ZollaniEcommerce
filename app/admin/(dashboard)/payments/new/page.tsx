import RecordPaymentForm from './RecordPaymentForm';

export default function RecordPaymentPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Add Client Record</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manually enter a client and their service record — the same details as a row in your
          spreadsheet: name, contact, service, amount charged, any cost incurred, payment status,
          and date. Works for paid, partially paid, unpaid, or cancelled jobs.
        </p>
      </div>
      <RecordPaymentForm />
    </div>
  );
}
