import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import MarqueeTop from '@/components/MarqueeTop';

// Display: Fraunces — variable, italic, characterful — replaces Cormorant Garamond.
// Loaded as variable (no static `weight`) so we can use SOFT + opsz axes for
// optical-size aware italics.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  axes: ['SOFT', 'opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

// Body: Instrument Sans — more character than DM Sans, less ubiquitous
const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-instrument',
  display: 'swap',
});

// Mono accent for prices / numbers / technical microcopy
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
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
      className={`${fraunces.variable} ${instrument.variable} ${mono.variable}`}
    >
      <body className="font-sans bg-cream text-ink min-h-screen flex flex-col">
        <CustomCursor />
        <MarqueeTop />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
