'use client';

import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { BisouMark } from '@/components/Logo';

type LinkItem = { href: string; label: string; external?: boolean };

const NAV: { label: string; links: LinkItem[] }[] = [
  {
    label: 'Le shop',
    links: [
      { href: '/produit/la-grip-sock', label: 'La chaussette' },
      { href: '/panier', label: 'Panier' },
    ],
  },
  {
    label: 'La marque',
    links: [
      { href: '/about', label: 'À propos' },
      { href: 'https://www.tiktok.com/@tantpis', label: 'TikTok', external: true },
      { href: 'https://www.instagram.com/tantpis', label: 'Instagram', external: true },
    ],
  },
  {
    label: 'Contact',
    links: [
      { href: 'mailto:hello@tantpis.fr', label: 'hello@tantpis.fr', external: true },
      { href: '/mentions-legales', label: 'Mentions légales' },
    ],
  },
];

export default function Footer() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  const wordY = useTransform(scrollYProgress, [0, 1], ['10%', '-4%']);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <footer
      ref={ref}
      id="site-footer"
      className="relative overflow-hidden bg-ink text-cream"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* HOOK — déclaration de clôture + newsletter */}
        <div className="grid gap-12 pt-20 md:grid-cols-[1.15fr_1fr] md:gap-20 md:pt-28">
          <Reveal as="div">
            <p className="flex items-start gap-3 font-display text-[clamp(2.1rem,5vw,4rem)] leading-[1.02]">
              <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
              <span>
                C’est la fin de la page.
                <br />
                <span className="text-cream/45">Pas la fin de l’histoire.</span>
              </span>
            </p>
          </Reveal>

          <Reveal as="div" delay={0.1} className="flex flex-col justify-end">
            {sent ? (
              <p className="font-display text-[1.6rem] leading-snug md:text-[2rem]">
                Merci. <span className="text-terra">À très vite.</span>
              </p>
            ) : (
              <>
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-terra">
                  Reste dans le coin
                </p>
                <form
                  onSubmit={onSubmit}
                  className="mt-4 flex items-center gap-3 border-b border-cream/25 pb-3 transition-colors focus-within:border-cream"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.fr"
                    aria-label="Ton adresse email"
                    className="w-full bg-transparent font-sans text-base text-cream placeholder:text-cream/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="S’inscrire à la newsletter"
                    className="shrink-0 text-lg leading-none text-cream transition-transform duration-300 hover:translate-x-1"
                  >
                    →
                  </button>
                </form>
                <p className="mt-3 font-sans text-[12px] leading-[1.5] text-cream/45">
                  Pas de spam. Juste quand on a un truc à dire (rarement).
                </p>
              </>
            )}
          </Reveal>
        </div>

        {/* NAV — colonnes raffinées, flèche au survol */}
        <Reveal delay={0.15} className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-24 md:grid-cols-4 md:gap-12">
          {NAV.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-terra">
                {col.label}
              </p>
              <ul className="mt-5 space-y-3 text-sm text-cream/80">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-terra">
              D’où ça vient
            </p>
            <p className="mt-5 text-sm leading-[1.7] text-cream/65">
              Designé à Paris 11<sup className="text-[0.7em]">e</sup>.
              <br />
              Tricoté à Vila Nova de Famalicão, Portugal.
            </p>
          </div>
        </Reveal>
      </div>

      {/* WORDMARK monumental — parallaxe douce, point = bisou au survol */}
      <div aria-hidden className="mt-16 select-none px-5 md:mt-24 md:px-10">
        <motion.p
          style={reduced ? undefined : { y: wordY }}
          className="group whitespace-nowrap text-center font-display text-[16vw] leading-[0.82] tracking-[-0.02em] text-cream md:text-[12.5vw]"
        >
          Tant Pis
          <BisouMark size="compact" />
        </motion.p>
      </div>

      {/* META — tout en bas */}
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col gap-3 border-t border-cream/15 py-6 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Tant Pis. · Tous droits réservés</p>
          <div className="flex items-center gap-6">
            <span>made with caffeine, not vibes</span>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
              }
              className="group/top inline-flex items-center gap-1.5 uppercase tracking-[0.16em] transition-colors hover:text-cream"
            >
              Tout en haut
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover/top:-translate-y-0.5"
              >
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Lien de footer avec flèche qui se révèle au survol. */
function FooterLink({ href, label, external }: LinkItem): ReactNode {
  const className =
    'group/link inline-flex items-center gap-1.5 transition-colors hover:text-terra';
  const inner = (
    <>
      {label}
      <span
        aria-hidden
        className="-translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
      >
        →
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
