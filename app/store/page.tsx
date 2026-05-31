import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Online Store',
  description: 'Shop quality electronics and accessories at the Zollani Tech online store.',
};

export default function StorePage() {
  // Redirect to the external store subdomain
  redirect(siteConfig.storeUrl);
}
