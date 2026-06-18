'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaystackVerifier({ invoiceId, reference }: { invoiceId: string; reference: string }) {
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      try {
        await fetch(`/api/invoice/verify?reference=${reference}&invoiceId=${invoiceId}`, { method: 'POST' });
        router.refresh();
      } catch {}
    }
    verify();
  }, [invoiceId, reference, router]);

  return null;
}
