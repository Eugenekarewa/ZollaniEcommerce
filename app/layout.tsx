import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Zollani Tech — Computer Repair & IT Support in Nairobi, Kenya',
    template: '%s | Zollani Tech',
  },
  description:
    'Professional computer repair, IT support, networking, virus removal, data recovery, and business IT services in Nairobi. Located on Thika Road, Muthaiga Business Centre.',
  keywords: [
    'computer repair Nairobi',
    'laptop repair Nairobi',
    'IT support Kenya',
    'data recovery Nairobi',
    'virus removal Nairobi',
    'networking Kenya',
    'Zollani Tech',
    'Muthaiga Business Centre',
    'Thika Road tech repair',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://zollani.co.ke',
    siteName: 'Zollani Tech',
    title: 'Zollani Tech — Computer Repair & IT Support in Nairobi',
    description:
      'Hardware repair, software troubleshooting, data recovery, virus removal, networking, and business IT support in Nairobi, Kenya.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@zollanitech',
  },
  metadataBase: new URL('https://zollani.co.ke'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-white text-charcoal">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
