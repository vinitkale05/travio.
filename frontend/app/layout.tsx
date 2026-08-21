import type { Metadata } from 'next';
import { Quicksand, Inter } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next';

// Force dynamic rendering for all pages — Clerk requires env vars at runtime
export const dynamic = "force-dynamic";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Travio - Collaborative Trip Planning',
  description: 'Plan trips together. No more WhatsApp chaos.',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        </head>
        <body className={`${quicksand.variable} ${inter.variable} font-sans bg-background-light text-slate-900 antialiased overflow-x-hidden`} suppressHydrationWarning>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
