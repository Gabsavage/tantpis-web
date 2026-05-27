'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function AboutFinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="about-cta" className="bg-terra text-cream">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-[820px] flex-col items-center px-6 py-24 text-center md:py-32"
      >
        <h2
          id="about-cta"
          className="font-display italic text-5xl leading-[1.02] tracking-tight md:text-6xl"
        >
          La Grip Sock vous attend.
        </h2>

        <Link
          href="/produit/la-grip-sock"
          className="group mt-10 inline-flex items-center gap-3 border border-cream px-7 py-4 text-[0.78rem] uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-cream hover:text-terra"
        >
          <span>Découvrir</span>
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
