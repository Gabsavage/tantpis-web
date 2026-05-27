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
      className="relative pt-16 md:pt-20"
    >
      {/* Pre-title small line — humanises the giant type below */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="px-5 pt-12 font-mono text-[0.65rem] uppercase tracking-[0.32em] text-ink/60 md:px-10 md:pt-16 md:text-[0.72rem]"
      >
        Paris 11e · depuis 2026 · une seule chaussette
      </motion.p>

      {/* Title block — clipped right edge so the oversized type bleeds slightly off-screen */}
      <div className="relative">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="font-display italic whitespace-nowrap leading-[0.85] tracking-[-0.02em] text-ink pl-5 md:pl-10 text-[22vw] md:text-[18vw] mt-3 md:mt-4"
        >
          <span>Tant Pis</span>
          <span aria-hidden className="not-italic">
            👄
          </span>
        </motion.h1>

        {/* Tagline — voice, not category */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          className="mt-6 max-w-2xl px-5 font-display italic text-[1.4rem] leading-tight text-ink md:mt-10 md:px-10 md:text-3xl"
        >
          Y’avait pas de chaussettes Pilates qu’on avait envie de porter.
          <br className="hidden md:block" /> Du coup, on les a faites.
        </motion.p>
      </div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        className="mt-10 w-full md:mt-14"
      >
        {heroImage}
      </motion.div>
    </section>
  );
}
