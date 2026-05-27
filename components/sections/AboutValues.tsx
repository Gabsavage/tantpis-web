'use client';

import { motion, useReducedMotion } from 'framer-motion';
import CountUp from '@/components/CountUp';

const VALUES = [
  {
    n: 1,
    title: 'Le beau, pas le bling',
    body: 'Des coloris pensés, des matières qui durent. Pas de logo partout. Juste bien fait.',
  },
  {
    n: 2,
    title: 'Le corps sans moralisme',
    body: 'On fait du Pilates parce qu’on aime ça, pas pour expier quelque chose. Tant pis pour la culpabilité.',
  },
  {
    n: 3,
    title: 'Bootstrap, pas bullshit',
    body: 'Une petite marque française qui fait ce qu’elle dit. Pas de storytelling vide. Juste le produit.',
  },
] as const;

export default function AboutValues() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-values"
      className="bg-white/30 px-5 py-24 md:px-10 md:py-32"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[1300px]"
      >
        <h2
          id="about-values"
          className="text-center text-[0.78rem] uppercase tracking-[0.32em] text-brown"
        >
          Ce qu&apos;on croit
        </h2>

        <ul className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-3 md:gap-12">
          {VALUES.map((v, i) => (
            <motion.li
              key={v.n}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.12 * i,
              }}
              className="flex flex-col"
            >
              <CountUp
                to={v.n}
                pad={2}
                className="font-display italic text-5xl leading-none text-brown/25"
              />
              <h3 className="mt-6 text-base text-dark">{v.title}</h3>
              <p className="mt-3 text-sm leading-[1.8] text-brown/80">
                {v.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
