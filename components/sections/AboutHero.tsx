'use client';

import { motion, useReducedMotion } from 'framer-motion';

const LINES: string[][] = [
  ['Entre', 'Paris'],
  ['et', 'les', 'Andes.'],
];

export default function AboutHero() {
  const reduced = useReducedMotion();

  let counter = 0;
  return (
    <section
      aria-labelledby="about-hero"
      className="bg-cream px-5 pb-16 pt-32 md:px-10 md:pt-40"
    >
      <h1
        id="about-hero"
        className="font-display italic leading-none tracking-[-0.02em] text-dark text-[10vw] md:text-[7vw]"
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
        className="mt-8 max-w-[480px] text-lg leading-relaxed text-brown/70 md:mt-10"
      >
        Tant Pis. est née d&apos;une conviction simple&nbsp;: on mérite des
        trucs beaux pour prendre soin de son corps. Sans moralisme. Sans
        excuses.
      </motion.p>
    </section>
  );
}
