'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Replaces the previous "3 values cards" — too generic.
 * Now a FAQ-style "questions qu’on nous pose" section with specific answers.
 */
const FAQS = [
  {
    q: 'Pourquoi 22 € ?',
    a: 'Parce qu’on a calculé. Coût de revient + transport + emballage + Stripe + douanes + un peu pour nous. À 22 €, on est rentables sur le volume, sans surfacturer parce qu’on aurait pu.',
  },
  {
    q: 'Pourquoi une seule taille ?',
    a: 'Le 36–42 couvre 80 % des pieds en France métropolitaine. Quand on aura les moyens de tenir deux SKUs en stock, on en fera deux. Pas avant.',
  },
  {
    q: 'Pourquoi pas d’abonnement ?',
    a: 'Une chaussette en coton bien faite, ça dure trois ans si tu la laves correctement. On voit pas l’intérêt qu’on t’en envoie une nouvelle tous les mois.',
  },
  {
    q: 'C’est vraiment fabriqué au Portugal ?',
    a: 'Oui. Vila Nova de Famalicão, district de Braga. Si tu veux passer voir, on a pas le contact direct de l’usine — mais la photo du loading dock est sur Instagram.',
  },
] as const;

export default function AboutValues() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-values"
      className="bg-cream px-5 py-24 md:px-10 md:py-36"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[900px]"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-ink/55">
          Questions qu’on nous pose
        </p>
        <h2
          id="about-values"
          className="font-display italic mt-6 text-4xl leading-[1.02] tracking-tight text-ink md:text-6xl"
        >
          Les réponses honnêtes<span aria-hidden>.👄</span>
        </h2>

        <dl className="mt-14 space-y-10 md:mt-20 md:space-y-14">
          {FAQS.map((f, i) => (
            <motion.div
              key={f.q}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08 * i,
              }}
              className="grid grid-cols-1 gap-3 border-t border-ink/15 pt-6 md:grid-cols-[140px_1fr] md:gap-12"
            >
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
                Q{String(i + 1).padStart(2, '0')}
              </dt>
              <dd>
                <p className="font-display italic text-2xl leading-tight text-ink md:text-3xl">
                  {f.q}
                </p>
                <p className="mt-4 text-[0.98rem] leading-[1.8] text-ink/80">
                  {f.a}
                </p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
