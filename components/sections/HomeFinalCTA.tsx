'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function HomeFinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="bg-dark text-cream"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-[820px] flex-col items-center px-6 py-28 text-center md:py-40"
      >
        <h2
          id="final-cta-heading"
          className="font-display italic text-5xl leading-[0.98] tracking-tight text-cream md:text-7xl"
        >
          Tant pis pour les excuses<span aria-hidden>👄</span>
        </h2>
        <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-cream/75 md:text-lg">
          Offre-toi ce qui te fait du bien.
        </p>

        <Link
          href="/produit/la-grip-sock"
          className="group mt-10 inline-flex items-center gap-3 border border-cream bg-cream px-8 py-4 text-[0.78rem] uppercase tracking-[0.22em] text-dark transition-colors duration-300 hover:bg-dark hover:text-cream"
        >
          <span>Découvrir la collection</span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
