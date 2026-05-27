'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type HomeStoryProps = {
  /** Server-rendered <PlaceholderImage /> for about-lima */
  aboutImage: ReactNode;
};

export default function HomeStory({ aboutImage }: HomeStoryProps) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="story-heading"
      className="bg-terra text-cream"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[680px] px-6 py-24 text-center md:py-36"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.32em] text-cream/70">
          — Notre histoire
        </p>
        <h2
          id="story-heading"
          className="font-display italic mt-6 text-5xl leading-[0.98] tracking-tight md:text-7xl"
        >
          Née entre Paris<br />et les Andes.
        </h2>
        <p className="mt-8 text-[1.05rem] leading-[1.75] text-cream/90 md:text-lg md:leading-[1.8]">
          Tant Pis. est née d&apos;une conviction simple : on mérite des trucs
          beaux pour faire du bien à son corps. Pas de moralisme. Pas
          d&apos;excuses. Juste ce qui nous fait du bien.
        </p>

        <div className="mt-10">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 border border-cream/70 px-7 py-3 text-[0.78rem] uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-cream hover:text-terra"
          >
            <span>Notre histoire</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </motion.div>

      {/* About image — slight opacity for a warmer integration with the terra bg */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 0.85 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="img-zoom"
        data-cursor="hover"
      >
        {aboutImage}
      </motion.div>
    </section>
  );
}
