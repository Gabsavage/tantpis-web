'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function HomeFinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="final-cta-heading" className="bg-ink text-cream">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-[1100px] flex-col items-start px-6 py-28 md:py-40"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-cream/55">
          Fin du défilement
        </p>
        <h2
          id="final-cta-heading"
          className="font-display italic mt-6 text-[14vw] leading-[0.9] tracking-[-0.02em] text-cream md:text-[7.5vw]"
        >
          Bon, tu prends<br />
          ou tu prends pas
          <span aria-hidden className="not-italic">.👄</span>
        </h2>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-16">
          <Link
            href="/produit/la-grip-sock"
            className="group inline-flex items-center justify-center gap-3 bg-rouge px-8 py-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-cream hover:text-rouge"
          >
            <span>Je prends — 22 €</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/about"
            className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-cream/65 underline-offset-4 hover:text-cream hover:underline"
          >
            Encore une minute
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
