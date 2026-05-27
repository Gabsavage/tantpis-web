'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type HomeHeroProps = {
  /** Server-rendered <PlaceholderImage /> slot for hero-flatlay.jpg */
  heroImage: ReactNode;
};

export default function HomeHero({ heroImage }: HomeHeroProps) {
  return (
    <section
      aria-label="Présentation"
      className="relative pt-28 md:pt-36"
    >
      {/* Title block — clipped right edge so the oversized type bleeds slightly off-screen */}
      <div className="relative">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="font-display italic whitespace-nowrap leading-[0.85] tracking-[-0.02em] text-dark pl-5 md:pl-10 text-[22vw] md:text-[18vw]"
        >
          <span>Tant Pis</span>
          <span aria-hidden className="not-italic">
            👄
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          className="mt-6 px-5 text-[0.65rem] uppercase tracking-[0.32em] text-brown md:mt-8 md:px-10 md:text-[0.78rem]"
        >
          Grip socks pour le Pilates — fait à Paris, pensé pour durer
        </motion.p>
      </div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        className="mt-10 w-full md:mt-14"
      >
        {heroImage}
      </motion.div>
    </section>
  );
}
