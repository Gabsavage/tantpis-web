'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type AboutFounderProps = {
  image: ReactNode;
};

export default function AboutFounder({ image }: AboutFounderProps) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="about-brand"
      className="bg-cream px-5 py-20 md:px-10 md:py-28"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-[1300px] grid-cols-1 gap-10 md:grid-cols-2 md:gap-16"
      >
        <div className="img-zoom" data-cursor="hover">
          {image}
        </div>

        <div className="md:pt-6">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-brown/60">
            La marque
          </p>
          <h2
            id="about-brand"
            className="font-display italic mt-4 text-4xl leading-[1.05] tracking-tight text-dark md:text-5xl"
          >
            Tant pis pour les excuses<span aria-hidden>👄</span>
          </h2>

          <div className="mt-8 space-y-6 text-[0.95rem] leading-[1.9] text-dark/80">
            <p>
              Tout a commencé à Paris, dans un studio de Pilates Reformer. La
              même question qui revient&nbsp;: des chaussettes qui restent en
              place, dans des coloris qu&apos;on a envie de porter, sans se
              ruiner. Ça n&apos;existait pas vraiment en France.
            </p>
            <p>
              Alors on a créé Tant Pis. Le nom dit tout&nbsp;: tant pis pour
              les compromis, tant pis pour les trucs fades qu&apos;on porte par
              défaut, tant pis pour attendre que quelqu&apos;un d&apos;autre le
              fasse.
            </p>
            <p>
              La marque a grandi entre Paris et Lima — les Andes comme métaphore
              de l&apos;essentiel, de ce qui reste quand on enlève le superflu.
              Ce n&apos;est pas du marketing. C&apos;est juste d&apos;où on
              vient.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
