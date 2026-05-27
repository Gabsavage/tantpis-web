'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function AboutFinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="about-cta" className="bg-rouge text-cream">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-[1100px] flex-col items-start px-6 py-24 md:py-32"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-cream/65">
          C’est tout pour aujourd’hui
        </p>
        <h2
          id="about-cta"
          className="font-display italic mt-6 text-[12vw] leading-[0.95] tracking-[-0.02em] md:text-[6.5vw]"
        >
          Allez, tu prends<br />
          une paire<span aria-hidden>.👄</span>
        </h2>

        <Link
          href="/produit/la-grip-sock"
          className="group mt-10 inline-flex items-center gap-3 border border-cream bg-cream px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-rouge transition-colors duration-300 hover:bg-rouge hover:text-cream"
        >
          <span>22 €, une paire</span>
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
