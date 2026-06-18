'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteExpenseButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this expense?')) return;
    setLoading(true);
    await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-gray-400 hover:text-red-600 disabled:opacity-40">
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
