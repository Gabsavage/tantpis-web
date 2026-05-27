'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Manifesto rupture — pure typography on rouge. Was a stock "founder story"
 * section; rewritten as a list of "tant pis pour [X]" statements that say
 * what the brand stands against. No image — confidence by absence.
 */
const MANIFESTO = [
  'pour les chaussettes qui glissent',
  'pour les marques qui font la leçon',
  'pour le minimalisme triste',
  'pour les mois sans nouveauté',
];

export default function HomeStory() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="story-heading"
      className="relative bg-rouge text-cream"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[1200px] px-5 py-28 md:px-10 md:py-40"
      >
        <p
          id="story-heading"
          className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-cream/70"
        >
          Manifeste · v.1
        </p>

        <ul className="mt-10 space-y-1 md:mt-14">
          {MANIFESTO.map((line, i) => (
            <motion.li
              key={line}
              initial={reduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 + i * 0.12,
              }}
              className="font-display italic leading-[0.95] tracking-[-0.015em] text-[12vw] md:text-[7.5vw]"
            >
              <span className="text-cream/40">Tant pis</span>{' '}
              <span>{line}.</span>
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1 + MANIFESTO.length * 0.12,
          }}
          className="mt-14 max-w-md text-[0.95rem] leading-[1.7] text-cream/85 md:mt-20 md:text-base"
        >
          On fait une seule chaussette pour l’instant. Trois couleurs. Pas de
          collection capsule, pas de drop tous les mois. Si tu en veux deux,
          super, la livraison est offerte. Sinon, tant pis.
        </motion.p>
      </motion.div>
    </section>
  );
}
