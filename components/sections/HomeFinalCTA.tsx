'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import { useUI } from '@/lib/ui-store';
import { products } from '@/lib/products';
import Reveal from '@/components/Reveal';
import Magnetic from '@/components/Magnetic';

const EASE = [0.22, 1, 0.36, 1] as const;

// « encore une minute » prend une voix selon le mood :
// — pass : on est en train de la perdre, on plaide. Les 3 phrases cyclent.
// — autres : phrase neutre.
const ENCORE_PASS = [
  'allez, juste l’histoire.',
  't’es sûre ?',
  'on en reparle ?',
] as const;
const ENCORE_DEFAULT = 'encore une minute ?';

const TEASES = [
  'c’est ça oui.',
  'bah voyons.',
  'on te croit.',
  'mouais.',
  'à d’autres.',
  'tant pis pour toi.',
  'même pas vrai.',
  'on s’en doutait.',
  'next.',
  'pfff.',
] as const;

const TERRA = '#C2604A';
const INK = '#2A1810';

type Mood = 'neutral' | 'take' | 'pass';

/**
 * Dernier appel — deux ambiances. Survol « Bon, tu prends. » : le fond reste
 * terracotta chaud, le CTA grandit, le « sinon, tant pis. » s'efface (mood
 * engagé). Survol « Ou tu prends pas. » : tout bascule en ink, le CTA s'efface
 * presque, le « sinon, tant pis. » swell — la marque s'en fout. Le bisou (SVG)
 * flashe près du curseur côté « pas » (« c'est ça oui. ») et s'imprime au clic.
 */
export default function HomeFinalCTA() {
  const reduced = useReducedMotion();
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  const product = products[0];
  const colorway = product.colorways[0];

  const [mood, setMood] = useState<Mood>('neutral');

  // Flash bisou + pique côté « pas »
  const [tease, setTease] = useState<{ x: number; y: number; text: string } | null>(null);
  const teaseTimer = useRef<number>();
  const teaseIdx = useRef(0);

  // Burst de petits cœurs SVG côté « take ».
  const [burstKey, setBurstKey] = useState(0);

  // « encore une minute » cycle quand le mood est pass.
  const [encoreIdx, setEncoreIdx] = useState(0);
  useEffect(() => {
    if (mood !== 'pass' || reduced) {
      setEncoreIdx(0);
      return;
    }
    const id = window.setInterval(() => {
      setEncoreIdx((i) => (i + 1) % ENCORE_PASS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [mood, reduced]);

  const encoreText = mood === 'pass' ? ENCORE_PASS[encoreIdx] : ENCORE_DEFAULT;

  // On ne se fie plus aux mouseenter de chaque ligne (les bboxes touchantes
  // produisent des transitions ambiguës aux frontières / sur les descendants
  // italiques). Le mood est piloté par la position verticale du curseur dans
  // la H2, avec une bande morte centrale qui absorbe le jitter.
  const lastMoodRef = useRef<Mood>('neutral');
  const neutralTimer = useRef<number>();
  const cancelNeutral = () => window.clearTimeout(neutralTimer.current);
  const killTease = () => {
    window.clearTimeout(teaseTimer.current);
    setTease(null);
  };

  const applyMood = (
    next: Mood,
    opts: { burst?: boolean; teaseAt?: { x: number; y: number } } = {}
  ) => {
    cancelNeutral();
    if (lastMoodRef.current === next) return;
    lastMoodRef.current = next;
    setMood(next);
    if (next === 'take') {
      killTease();
      if (opts.burst && !reduced) setBurstKey((k) => k + 1);
    }
    if (next === 'pass' && opts.teaseAt && !reduced) {
      const text = TEASES[teaseIdx.current % TEASES.length];
      teaseIdx.current += 1;
      setTease({ x: opts.teaseAt.x, y: opts.teaseAt.y, text });
      window.clearTimeout(teaseTimer.current);
      teaseTimer.current = window.setTimeout(() => setTease(null), 1100);
    }
  };

  // Léger délai avant retour au neutre : évite le flicker quand le curseur
  // sort de la H2 pour entrer immédiatement dans le bouton CTA (ou inverse).
  const scheduleNeutral = () => {
    cancelNeutral();
    // annule un rAF de mousemove en attente pour qu'il ne ré-écrase pas
    // le neutre une frame plus tard.
    if (moveRafRef.current !== null) {
      window.cancelAnimationFrame(moveRafRef.current);
      moveRafRef.current = null;
      pendingMoveRef.current = null;
    }
    neutralTimer.current = window.setTimeout(() => {
      if (lastMoodRef.current === 'neutral') return;
      lastMoodRef.current = 'neutral';
      setMood('neutral');
      killTease();
    }, 120);
  };

  // Mousemove sur la H2 → mood selon la moitié verticale + bande morte.
  // rAF-throttle : on ne traite qu'un event par frame (max ~60 Hz), et
  // getBoundingClientRect est repoussé dans la rAF pour ne pas forcer un
  // layout sync à chaque mousemove pendant les anims.
  const moveRafRef = useRef<number | null>(null);
  const pendingMoveRef = useRef<{
    x: number;
    y: number;
    target: HTMLHeadingElement;
  } | null>(null);

  const onH2Move = (e: React.MouseEvent<HTMLHeadingElement>) => {
    pendingMoveRef.current = {
      x: e.clientX,
      y: e.clientY,
      target: e.currentTarget,
    };
    if (moveRafRef.current !== null) return;
    moveRafRef.current = window.requestAnimationFrame(() => {
      moveRafRef.current = null;
      const p = pendingMoveRef.current;
      if (!p) return;
      const rect = p.target.getBoundingClientRect();
      const y = p.y - rect.top;
      const mid = rect.height / 2;
      const band = rect.height * 0.06;
      let target: Mood;
      if (y < mid - band) target = 'take';
      else if (y > mid + band) target = 'pass';
      else if (lastMoodRef.current === 'neutral') {
        target = y < mid ? 'take' : 'pass';
      } else {
        return;
      }
      if (target === 'take') applyMood('take', { burst: true });
      else applyMood('pass', { teaseAt: { x: p.x, y: p.y } });
    });
  };

  // Tampon bisou au clic, puis ajout panier
  const [stamping, setStamping] = useState(false);

  const handleTake = () => {
    const doAdd = () => {
      add(
        {
          id: `${product.slug}-${colorway.name.toLowerCase()}`,
          slug: product.slug,
          name: product.name,
          colorway: colorway.name,
          hex: colorway.hex,
          image: colorway.image,
          price: product.price,
        },
        1
      );
      openCart();
    };
    if (reduced) {
      doAdd();
      return;
    }
    setStamping(true);
    window.setTimeout(() => {
      setStamping(false);
      doAdd();
    }, 500);
  };

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden text-cream"
      style={{ backgroundColor: TERRA }}
    >
      {/* layer ink par-dessus terra : on fade l'opacité au lieu d'interpoler
          backgroundColor sur toute la section. Anim compositée GPU, zero paint. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: INK, willChange: 'opacity' }}
        initial={false}
        animate={{ opacity: mood === 'pass' ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <div className="relative mx-auto max-w-[1200px] px-[6%] py-32 md:py-48">
        {/* preuve — petite ligne caps */}
        <Reveal
          as="p"
          className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-cream/65 md:text-[11px]"
        >
          25 € la paire
          <span className="mx-2 text-cream/30">—</span>
          Livraison offerte dès 2 paires
          <span className="mx-2 text-cream/30">—</span>
          Retours 30 jours
        </Reveal>

        {/* headline monumental — deux zones de hover */}
        <Reveal as="div" delay={0.05} className="mt-7 md:mt-9">
          <h2
            id="final-cta-heading"
            onMouseMove={onH2Move}
            onMouseLeave={scheduleNeutral}
            className="w-fit font-display text-[clamp(3rem,11vw,9rem)] italic leading-[0.9] tracking-[-0.01em]"
          >
            <motion.span
              role="button"
              tabIndex={0}
              aria-label={`Je le prends — ${product.price} €`}
              onClick={handleTake}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTake();
                }
              }}
              className="relative block w-fit cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/70"
              animate={{ opacity: mood === 'pass' ? 0.22 : 1 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              Bon,{' '}
              <span className="relative inline-block">
                tu prends.
                {/* underline qui se trace au survol = signal CTA */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-[0.04em] block h-[0.045em] origin-left bg-cream"
                  animate={{ scaleX: mood === 'take' ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </span>
              {/* volée de petits cœurs qui s'envolent — SVG only */}
              <AnimatePresence>
                {burstKey > 0 && <HeartBurst key={burstKey} />}
              </AnimatePresence>
            </motion.span>
            <motion.span
              className="block w-fit cursor-default"
              animate={{
                opacity: mood === 'pass' ? 1 : mood === 'take' ? 0.18 : 0.45,
              }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              Ou tu prends pas.
            </motion.span>
          </h2>
        </Reveal>

        {/* CTA + kicker — leur poids s'inverse selon le mood */}
        <Reveal delay={0.15} className="mt-12 md:mt-16">
          <div
            className="flex flex-col items-start gap-6 sm:flex-row sm:items-center"
            onMouseLeave={scheduleNeutral}
          >
            <motion.div
              animate={{
                opacity: mood === 'pass' ? 0.14 : 1,
                scale: mood === 'take' ? 1.04 : 1,
              }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <Magnetic>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => applyMood('take', { burst: true })}
                    onClick={handleTake}
                    disabled={stamping}
                    className="group inline-flex items-center gap-3 bg-ink px-7 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-ink/85"
                  >
                    Je le prends — 25 €
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>

                  {/* tampon bisou — signature au clic */}
                  <AnimatePresence>
                    {stamping && (
                      <motion.span
                        key="stamp"
                        aria-hidden
                        className="pointer-events-none absolute inset-0 grid place-items-center"
                        initial={{ opacity: 0, scale: 1.6, rotate: -16 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [1.6, 0.95, 1, 1], rotate: -8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE, times: [0, 0.35, 0.65, 1] }}
                      >
                        <KissMark className="block h-10 w-11" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Magnetic>
            </motion.div>

            {/* kicker mono-ligne : « encore une minute ? sinon tant pis. ».
                La 1re partie est un Link qui cycle en mood pass ; la 2e est
                statique. Toute la ligne pilote le mood pass (hover = camp
                « ou tu prends pas. ») et swell quand pass commit. */}
            <motion.div
              onMouseEnter={() => applyMood('pass')}
              className="w-fit cursor-default font-display italic leading-tight text-[1.4rem] md:text-[1.75rem]"
              animate={{
                opacity: mood === 'pass' ? 1 : mood === 'take' ? 0.25 : 0.7,
                scale: mood === 'pass' ? 1.05 : 1,
                x: mood === 'pass' ? 4 : 0,
              }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{ transformOrigin: 'left center' }}
            >
              <Link
                href="/about"
                className="group/min inline-block cursor-pointer text-cream"
              >
                <span className="relative inline-block">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={encoreText}
                      className="inline-block"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      {encoreText}
                    </motion.span>
                  </AnimatePresence>
                  {/* underline qui se trace au hover du link */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -bottom-[0.1em] block h-[0.04em] origin-left scale-x-0 bg-cream transition-transform duration-500 ease-out group-hover/min:scale-x-100"
                  />
                </span>
              </Link>
              {' '}sinon tant pis.
            </motion.div>
          </div>
        </Reveal>
      </div>

      {/* flash bisou + pique au survol — suit le curseur */}
      <AnimatePresence>
        {tease && (
          <motion.div
            key="tease"
            aria-hidden
            className="pointer-events-none fixed z-[80] flex items-center gap-3"
            style={{ left: tease.x, top: tease.y, transform: 'translate(14px, -130%)' }}
            initial={{ opacity: 0, y: 10, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.85 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <KissMark className="block h-8 w-9" />
            <span className="whitespace-nowrap font-display text-xl italic text-cream md:text-2xl">
              {tease.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Volée de cœurs SVG qui s'envolent depuis la ligne « Bon, tu prends. ».
 * Forme un arc de cercle au pic : plus haut et plus gros au centre, plus bas
 * et plus petits aux extrémités. Léger stagger pour un effet de ripple.
 * DESIGN_SYSTEM : jamais d'emoji, le cœur est en SVG plein.
 */
function HeartBurst() {
  const hearts = [
    { left: '6%',  yMax: -38, size: 30, rotate: -22, delay: 0 },
    { left: '22%', yMax: -58, size: 38, rotate: -12, delay: 0.05 },
    { left: '40%', yMax: -74, size: 44, rotate: -4,  delay: 0.1 },
    { left: '58%', yMax: -74, size: 44, rotate: 4,   delay: 0.1 },
    { left: '76%', yMax: -58, size: 38, rotate: 12,  delay: 0.05 },
    { left: '92%', yMax: -38, size: 30, rotate: 22,  delay: 0 },
  ];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
      {hearts.map((h, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 32 32"
          fill="#F2E8DC"
          className="pointer-events-none absolute"
          style={{
            left: h.left,
            top: 0,
            width: `${h.size}px`,
            height: `${h.size}px`,
          }}
          initial={{ y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            y: h.yMax,
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1, 0.9],
            rotate: h.rotate,
          }}
          transition={{
            duration: 1.1,
            delay: h.delay,
            ease: EASE,
            times: [0, 0.2, 0.7, 1],
          }}
        >
          <path d="M16 24 C16 24 8 19 8 13.5 C8 10.5 10.3 9 12.5 9 C14 9 15.4 10 16 11.2 C16.6 10 18 9 19.5 9 C21.7 9 24 10.5 24 13.5 C24 19 16 24 16 24 Z" />
        </motion.svg>
      ))}
    </span>
  );
}

/**
 * Le bisou en SVG, fill crème (lisible terra ET ink). Mêmes tracés que le logo,
 * inclinés 14° comme dans son animation. DESIGN_SYSTEM : bisou en SVG only.
 * Rotation « brand » sur le SVG interne, pas sur le wrapper, pour laisser la
 * rotation animable côté caller (le tampon au clic).
 */
function KissMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      <svg
        viewBox="0 0 36 32"
        className="block h-full w-full rotate-[14deg]"
        fill="#F2E8DC"
        aria-hidden
      >
        <path d="M4 14 C8 6 14 6 18 11 C22 6 28 6 32 14 C27.5 12 22 13 18 13.8 C14 13 8.5 12 4 14 Z" />
        <path d="M5 15 C13 16.4 23 16.4 31 15 C26 27 10 27 5 15 Z" />
      </svg>
    </span>
  );
}
