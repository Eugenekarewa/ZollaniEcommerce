import RecordPaymentForm from './RecordPaymentForm';

export default function RecordPaymentPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-charcoal">Record a Payment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Log a payment that already happened — cash, M-Pesa, bank transfer, or an earlier-month
          transaction not yet in the system. This creates a paid invoice with the date you specify,
          so your revenue reports stay accurate.
        </p>
      </div>
      <RecordPaymentForm />
    </div>
  );
}
