import type { Metadata } from 'next';
import PlaceholderImage from '@/components/PlaceholderImage';
import AboutHero from '@/components/sections/AboutHero';
import AboutFounder from '@/components/sections/AboutFounder';
import AboutValues from '@/components/sections/AboutValues';
import AboutFinalCTA from '@/components/sections/AboutFinalCTA';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Une petite marque française entre Paris et Lima. Des grip socks pensées pour le studio, dessinées pour le quotidien.',
  openGraph: {
    title: 'À propos — Tant Pis.',
    description:
      'Une petite marque française entre Paris et Lima. Pas de moralisme. Pas d\'excuses.',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <AboutFounder
        image={
          /* IMG SLOT: /public/images/about-lima.jpg — 1440×960 (used here in 3:4) */
          <PlaceholderImage
            src="/images/about-lima.jpg"
            alt="Tant Pis. — entre Paris et Lima"
            aspect="3/4"
            fallbackColor="#C2604A"
            width={1440}
            height={1920}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        }
      />

      <AboutValues />

      <AboutFinalCTA />
    </>
  );
}
