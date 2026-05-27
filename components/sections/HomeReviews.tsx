'use client';

import { motion, useReducedMotion } from 'framer-motion';

// TODO: remplacer par vrais avis (UGC TikTok / clientes)
const REVIEWS = [
  {
    username: '@lou.studio',
    color: '#C2604A',
    stars: 5,
    body:
      'Je galérais avec les chaussettes qui glissent au Reformer. Là, plus jamais. Et la couleur terracotta tue.',
  },
  {
    username: '@camille.pilates',
    color: '#8A9E8C',
    stars: 5,
    body:
      "C'est rare un truc à la fois beau ET vraiment efficace. Le grip est parfait, le coton est doux.",
  },
  {
    username: '@inès.studio',
    color: '#7A4F3A',
    stars: 5,
    body:
      "Je les porte au studio, à la maison, au café d'après-cours. Compliments à chaque fois.",
  },
] as const;

function Stars({ count }: { count: number }) {
  return (
    <span
      aria-label={`${count} sur 5`}
      className="inline-flex items-center gap-0.5 text-dark"
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.5l2.97 6.02 6.65.97-4.81 4.69 1.14 6.62L12 17.77l-5.95 3.13 1.14-6.62L2.38 9.49l6.65-.97L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function HomeReviews() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="reviews-heading"
      className="bg-cream py-24 md:py-32"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 md:px-10"
      >
        <h2
          id="reviews-heading"
          className="text-center text-[0.78rem] uppercase tracking-[0.32em] text-brown"
        >
          Elles en parlent
        </h2>

        {/* Mobile: horizontal scroll snap; Desktop: 3-up grid */}
        <ul
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-4 md:mx-auto md:mt-16 md:grid md:max-w-[1300px] md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {REVIEWS.map((r, i) => (
            <motion.li
              key={r.username}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 * i,
              }}
              className="snap-center shrink-0 basis-[78%] sm:basis-[55%] md:basis-auto md:shrink"
            >
              <article className="flex h-full flex-col gap-5 border border-dark/10 bg-cream p-7 transition-colors duration-300 hover:border-dark/30">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="h-12 w-12 shrink-0 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-display italic text-lg text-dark">
                      {r.username}
                    </span>
                    <Stars count={r.stars} />
                  </div>
                </div>
                <p className="text-[0.95rem] leading-[1.65] text-dark/80">
                  &laquo; {r.body} &raquo;
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
