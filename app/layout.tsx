import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import MarqueeTop from '@/components/MarqueeTop';
import CartDrawer from '@/components/CartDrawer';
import TopSpacer from '@/components/TopSpacer';

// Display : Cormorant Garamond — toujours italic, weight 500. L'unique déco.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Corps & labels : Inter — 400 (corps) et 500 (labels, caps, CTA).
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: 'Tant Pis.',
    template: '%s — Tant Pis.',
  },
  description:
    'Des chaussettes Pilates qu’on a envie de porter. Faites au Portugal, vendues 22 € la paire.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Tant Pis.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="font-sans bg-cream text-ink min-h-screen flex flex-col">
        <CustomCursor />
        <MarqueeTop />
        <Header />
        <TopSpacer />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
