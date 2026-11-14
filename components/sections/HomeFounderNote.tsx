import Reveal from '@/components/Reveal';

/**
 * Note des fondateurs — respiration entre le hero vidéo et le produit. Variante
 * éditoriale décalée : guillemet « géant en terracotta à gauche, la headline en
 * Cormorant italic calée à droite, signature espiègle en bas. Se distingue des
 * témoignages clients (format compact + @handle) par le guillemet géant + la
 * signature manuscrite-typo.
 */
export default function HomeFounderNote() {
  return (
    <section
      aria-label="Note des fondateurs"
      className="relative overflow-hidden bg-cream py-16 md:py-24"
    >
      <div className="relative mx-auto max-w-[1100px] px-[6%]">
        {/* guillemet ouvrant géant — accent terracotta, déborde à gauche */}
        <span
          aria-hidden
          className="block select-none font-display text-[24vw] leading-[0.45] text-terra md:text-[14vw]"
        >
          «
        </span>

        <blockquote className="mt-2 md:ml-[16%] md:-mt-[8vw]">
          <Reveal
            as="p"
            variant="up"
            className="max-w-[760px] font-display text-[clamp(1.9rem,4.6vw,3.4rem)] italic leading-[1.18] tracking-[-0.01em] text-ink"
          >
            Y’avait pas de chaussettes Pilates qu’on avait envie de porter.
            Du coup, on les a faites.
            <span className="text-terra"> »</span>
          </Reveal>

          <Reveal as="div" variant="up" delay={0.15} className="mt-8 md:mt-10">
            <span className="block font-display text-[1.6rem] italic leading-none text-ink md:text-[2rem]">
              Signé, des gens bien chaussés.
            </span>
            <span className="mt-3 block font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-tabac md:text-[11px]">
              Paris 11<sup className="text-[0.7em]">e</sup> · 9 prototypes plus tard
            </span>
          </Reveal>
        </blockquote>
      </div>
    </section>
  );
}
