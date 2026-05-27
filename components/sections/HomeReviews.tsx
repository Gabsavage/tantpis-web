'use client';

import { motion, useReducedMotion } from 'framer-motion';

// TODO: remplacer par vrais avis (UGC TikTok / clientes) quand on en a
const REVIEWS = [
  {
    handle: '@lou_pilates',
    location: 'Paris 11e',
    body:
      'J’ai testé sur 4 cours de Reformer cette semaine. Zero glissade. Et la couleur terra va avec littéralement tout.',
    color: '#C2604A',
  },
  {
    handle: '@camille.studio',
    location: 'Lyon',
    body:
      'Je portais des Bombas que je commandais aux US. Là c’est aussi bien, en France, à 22 €. Tant pis pour Bombas.',
    color: '#8A9E8C',
  },
  {
    handle: '@inès.k',
    location: 'Marseille',
    body:
      'Je les ai mises trois fois cette semaine — studio, maison, brunch. Personne ne sait que c’est des chaussettes de Pilates.',
    color: '#F4ECDC',
  },
] as const;

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
        className="mx-auto max-w-[1300px] px-5 md:px-10"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h2
            id="reviews-heading"
            className="font-display italic text-4xl leading-[1] tracking-tight text-ink md:text-6xl"
          >
            On nous écrit des trucs<br className="hidden md:block" /> assez gentils.
          </h2>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ink/55">
            3 / 3 — clientes vérifiées
          </p>
        </div>

        {/* Quotes — large featured + two smaller, asymmetric */}
        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-12">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.handle}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 * i,
              }}
              className={[
                i === 0 ? 'md:col-span-2 md:row-span-1' : '',
                'relative flex flex-col gap-5',
              ].join(' ')}
            >
              <blockquote
                className={[
                  'font-display italic leading-[1.05] tracking-[-0.01em] text-ink',
                  i === 0 ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl',
                ].join(' ')}
              >
                <span aria-hidden className="text-rouge">«&nbsp;</span>
                {r.body}
                <span aria-hidden className="text-rouge">&nbsp;»</span>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: r.color }}
                />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/65">
                  {r.handle} · {r.location}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
