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
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ink/55">
            Comment c’est arrivé
          </p>
          <h2
            id="about-brand"
            className="font-display italic mt-4 text-4xl leading-[1.02] tracking-tight text-ink md:text-5xl"
          >
            On en avait marre des chaussettes qui glissent<span aria-hidden>.👄</span>
          </h2>

          <div className="mt-8 space-y-6 text-[0.98rem] leading-[1.85] text-ink/85">
            <p>
              On faisait du Reformer trois fois par semaine, dans un studio
              Paris 11e. Toujours le même problème&nbsp;: les chaussettes Pilates
              en vente à l’accueil étaient soit moches (le coup du logo brodé
              énorme), soit trop chères (38 € pour deux picots à l’avant), soit
              importées des États-Unis avec deux semaines de livraison.
            </p>
            <p>
              On a cherché des fabricants. Pas trouvé tout de suite. On a
              testé&nbsp;: la Turquie (qualité OK, palette bof), l’Italie (trop
              cher pour un prix de vente sous 25 €), puis le Portugal — Vila
              Nova de Famalicão, la zone textile au nord de Porto qui fait pour
              pas mal de marques qu’on aime bien. C’est là qu’on a trouvé la
              maille qui tient sans gratter.
            </p>
            <p>
              On a écrit 9 prototypes. On a viré les picots à l’avant pour
              passer en full sole. On a changé deux fois de coloris. On s’est
              décidées sur trois&nbsp;: terracotta, crème, sauge. Pas de
              storytelling énorme là-dessous. Juste des chaussettes faites
              correctement et qu’on a envie de porter.
            </p>
          </div>

          <p className="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
            — L’équipe, Paris 11e
          </p>
        </div>
      </motion.div>
    </section>
  );
}
