'use client';

import { motion, useReducedMotion } from 'framer-motion';

const LINES: string[][] = [
  ['On', 'fait', 'des'],
  ['chaussettes.'],
];

export default function AboutHero() {
  const reduced = useReducedMotion();

  let counter = 0;
  return (
    <section
      aria-labelledby="about-hero"
      className="bg-cream px-5 pb-16 pt-32 md:px-10 md:pt-40"
    >
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-ink/55">
        À propos · v.1 · mai 2026
      </p>
      <h1
        id="about-hero"
        className="font-display italic leading-[0.95] tracking-[-0.02em] text-ink text-[12vw] md:text-[8vw] mt-6 md:mt-8"
      >
        {LINES.map((line, li) => (
          <span key={li} className="block">
            {line.map((word) => {
              const i = counter++;
              return (
                <motion.span
                  key={`${li}-${i}`}
                  initial={reduced ? false : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.15 * i,
                  }}
                  className="inline-block whitespace-pre"
                >
                  {word}{' '}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
        className="mt-10 max-w-[520px] font-display italic text-[1.3rem] leading-tight text-ink md:mt-12 md:text-3xl"
      >
        Une seule pour l’instant. Trois couleurs. 22 € la paire.
        <br />
        Tant pis pour le reste.
      </motion.p>
    </section>
  );
}
