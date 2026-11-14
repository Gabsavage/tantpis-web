'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

/**
 * Manifeste — séquence scrollytelling épinglée. La section reste figée dans le
 * viewport pendant ~5 écrans de scroll ; la progression native joue une scène
 * par phrase, chacune avec une animation liée à son sens, puis une scène de
 * résolution. Le fond bascule crème ↔ terracotta au fil des scènes, le texte
 * suit (ink sur crème, crème sur terra) et le mot-clé passe en terra sur les
 * scènes crème. Fallback statique si l'utilisateur préfère moins d'animations.
 */
const LINES = [
  'pour les chaussettes qui glissent',
  'pour les marques qui font la leçon',
  'pour le minimalisme triste',
  'pour les mois sans nouveauté',
];
const TOTAL = 5; // 4 phrases + résolution
// Hauteur de scroll par scène. > 100svh = chaque phrase joue son anim tôt puis
// reste figée un moment (« gap ») avant la suivante : en scrollant vite on ne
// traverse pas toutes les animations d'un coup.
const SCENE_VH = 165;
// Le fond bascule scène par scène (crème ↔ terracotta).
const BG = ['#F2E8DC', '#C2604A', '#F2E8DC', '#C2604A', '#F2E8DC'];

export default function HomeStory() {
  const reduced = useReducedMotion();
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Fond interpolé : maintien d'une couleur par scène, bascule rapide dans la
  // bande étroite autour de chaque frontière.
  const slot = 1 / TOTAL;
  const d = slot * 0.09;
  const stops: number[] = [0];
  const bgCols: string[] = [BG[0]];
  for (let i = 1; i < TOTAL; i++) {
    const b = i * slot;
    stops.push(b - d, b + d);
    bgCols.push(BG[i - 1], BG[i]);
  }
  stops.push(1);
  bgCols.push(BG[TOTAL - 1]);
  const bg = useTransform(scrollYProgress, stops, bgCols);

  if (reduced) return <StaticManifesto />;

  return (
    <section
      ref={container}
      aria-labelledby="story-heading"
      className="relative bg-cream"
      style={{ height: `${TOTAL * SCENE_VH}svh` }}
    >
      {/* Contenu canonique pour lecteurs d'écran (les scènes sont décoratives). */}
      <p id="story-heading" className="sr-only">
        Manifeste. {LINES.map((l) => `Tant pis ${l}.`).join(' ')} On fait une
        seule chaussette pour l’instant. Trois couleurs.
      </p>

      <motion.div
        style={{ backgroundColor: bg }}
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden"
      >
        {/* Scènes empilées, pilotées par la progression */}
        <SceneGlissent progress={scrollYProgress} i={0} />
        <SceneLecon progress={scrollYProgress} i={1} />
        <SceneMinimalisme progress={scrollYProgress} i={2} />
        <SceneMois progress={scrollYProgress} i={3} />
        <SceneResolution progress={scrollYProgress} i={4} />
      </motion.div>
    </section>
  );
}

/* ---------- Helpers ---------- */

const SLOT = 1 / TOTAL;

/** Enveloppe d'opacité d'une scène + progression locale 0→1 sur son créneau. */
function useScene(progress: MotionValue<number>, i: number, isLast = false) {
  const start = i * SLOT;
  const end = (i + 1) * SLOT;
  const p = useTransform(progress, [start, end], [0, 1], { clamp: true });
  // Entrée rapide, long maintien (« gap »), sortie rapide.
  const opacity = useTransform(
    progress,
    isLast
      ? [start, start + SLOT * 0.18, 1]
      : [start, start + SLOT * 0.08, end - SLOT * 0.1, end],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
    { clamp: true }
  );
  return { p, opacity };
}

const sceneClass =
  'absolute inset-0 flex flex-col items-center justify-center px-[7%] text-center';
const prefixClass =
  'mb-3 block font-display text-[clamp(1.1rem,3vw,2.25rem)] italic leading-none md:mb-5';
const predicateClass =
  'block font-display text-[clamp(2.1rem,6.8vw,5.75rem)] italic leading-[0.98] tracking-[-0.01em]';

/** tone 'light' = sur terracotta (texte crème) ; 'dark' = sur crème (texte ink). */
function Prefix({ tone }: { tone: 'light' | 'dark' }) {
  return (
    <span
      className={`${prefixClass} ${tone === 'light' ? 'text-cream/45' : 'text-ink/30'}`}
    >
      Tant pis
    </span>
  );
}

/* ---------- Scène 0 — « qui glissent » : entre en dérapant, refuse de glisser ---------- */
function SceneGlissent({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const { opacity } = useScene(progress, i);
  const start = i * SLOT;
  const end = (i + 1) * SLOT;
  const k = (t: number) => start + (end - start) * t;
  // Glissade : déboule de loin, dépasse le centre, contre-dérape, se cale net,
  // tient figé, puis re-glisse au moment de partir.
  const x = useTransform(
    progress,
    [k(0), k(0.16), k(0.28), k(0.42), k(0.86), k(1)],
    ['-65%', '14%', '-4%', '0%', '0%', '68%']
  );
  const skewX = useTransform(
    progress,
    [k(0), k(0.16), k(0.28), k(0.42), k(0.86), k(1)],
    [-12, 7, -3, 0, 0, 14]
  );
  // étirement horizontal pendant la phase rapide = traînée de vitesse
  const scaleX = useTransform(
    progress,
    [k(0), k(0.16), k(0.42)],
    [1.14, 1.04, 1]
  );
  // « glissent » dérape un poil plus que le reste
  const slipX = useTransform(progress, [k(0), k(0.42)], ['-22%', '0%']);

  return (
    <motion.div aria-hidden style={{ opacity }} className={sceneClass}>
      <Prefix tone="dark" />
      <motion.span style={{ x, skewX, scaleX }} className={`${predicateClass} text-ink`}>
        pour les chaussettes
        <br />
        qui{' '}
        <motion.span style={{ x: slipX }} className="inline-block text-terra">
          glissent
        </motion.span>
        <span className="text-ink/40">.</span>
      </motion.span>
    </motion.div>
  );
}

/* ---------- Scène 1 — « la leçon » : on souligne… puis on raye ---------- */
function SceneLecon({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const { opacity } = useScene(progress, i);
  const start = i * SLOT;
  const end = (i + 1) * SLOT;
  const k = (t: number) => start + (end - start) * t;
  const y = useTransform(progress, [k(0), k(0.16)], [28, 0]);
  const underline = useTransform(progress, [k(0.2), k(0.42)], [0, 1], { clamp: true });
  const strike = useTransform(progress, [k(0.48), k(0.72)], [0, 1], { clamp: true });

  return (
    <motion.div aria-hidden style={{ opacity }} className={sceneClass}>
      <Prefix tone="light" />
      <motion.span style={{ y }} className="relative inline-block">
        <span className={`${predicateClass} text-cream/80`}>
          pour les marques
          <br />
          qui font la <span className="text-cream">leçon</span>
          <span className="text-cream/50">.</span>
        </span>
        {/* trait de correction (souligne) */}
        <motion.span
          className="absolute -bottom-1 left-0 block h-[2px] w-full bg-cream/80"
          style={{ scaleX: underline, transformOrigin: 'left' }}
        />
        {/* rature (barre) */}
        <motion.span
          className="absolute left-0 top-1/2 block h-[3px] w-full bg-cream"
          style={{ scaleX: strike, transformOrigin: 'left' }}
        />
      </motion.span>
    </motion.div>
  );
}

/* ---------- Scène 2 — « minimalisme triste » : froid & espacé → se réchauffe, « triste » se redresse ---------- */
function SceneMinimalisme({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const { opacity } = useScene(progress, i);
  const start = i * SLOT;
  const end = (i + 1) * SLOT;
  const k = (t: number) => start + (end - start) * t;
  const letterSpacing = useTransform(progress, [k(0), k(0.5)], ['0.5em', '-0.01em']);
  const tristeRotate = useTransform(progress, [k(0.08), k(0.54)], [9, 0]);
  const tristeY = useTransform(progress, [k(0.08), k(0.54)], ['0.2em', '0em']);

  return (
    <motion.div aria-hidden style={{ opacity }} className={sceneClass}>
      <Prefix tone="dark" />
      <motion.span className={`${predicateClass} text-ink`} style={{ letterSpacing }}>
        pour le minimalisme{' '}
        <motion.span
          className="inline-block text-terra"
          style={{ rotate: tristeRotate, y: tristeY, transformOrigin: 'left bottom' }}
        >
          triste
        </motion.span>
        <span className="text-ink/40">.</span>
      </motion.span>
    </motion.div>
  );
}

/* ---------- Scène 3 — « sans nouveauté » : les mois défilent, monotones, puis se figent ---------- */
const SANS_WORDS = [
  'nouveauté',
  'fun',
  'excuse',
  'grip',
  'matcha',
  'piment',
  'folie',
  'tapis',
  'couleur',
  'pilates',
  'café',
  'tant pis',
];
function SceneMois({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const { opacity } = useScene(progress, i);
  const start = i * SLOT;
  const end = (i + 1) * SLOT;
  const k = (t: number) => start + (end - start) * t;
  // défile vite puis ralentit pour se figer sur « tant pis »
  const reel = [...SANS_WORDS, ...SANS_WORDS];
  const land = `-${(reel.length - 1) * (100 / reel.length)}%`;
  const y = useTransform(progress, [k(0), k(0.58), k(1)], ['0%', land, land]);

  // La fenêtre épouse la largeur du mot courant (mesurée) → « sans » reste
  // collé au mot, pas d'espace vide. Re-mesuré aux changements de taille.
  const measure = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);
  useEffect(() => {
    let alive = true;
    const m = () => {
      if (alive) setWidths(measure.current.map((el) => (el ? el.offsetWidth : 0)));
    };
    m();
    if (document.fonts?.ready) document.fonts.ready.then(m);
    window.addEventListener('resize', m);
    return () => {
      alive = false;
      window.removeEventListener('resize', m);
    };
  }, []);

  const localT = useTransform(progress, [k(0), k(0.58)], [0, 1], { clamp: true });
  const [idx, setIdx] = useState(SANS_WORDS.length - 1);
  useMotionValueEvent(localT, 'change', (v) => {
    const visible = Math.min(reel.length - 1, Math.round(v * (reel.length - 1)));
    setIdx(visible % SANS_WORDS.length);
  });

  const winW = widths.length ? widths[idx] : undefined;

  return (
    <motion.div aria-hidden style={{ opacity }} className={sceneClass}>
      <Prefix tone="light" />
      <span className={`${predicateClass} text-cream`}>pour les mois</span>
      {/* « sans » fixe + le mot qui défile (fenêtre à la largeur du mot courant) */}
      <span className="mt-1 flex items-center justify-center gap-[0.3em] md:mt-2">
        <span className={`${predicateClass} text-cream`}>sans</span>
        <span
          className="relative inline-block overflow-hidden font-display text-[clamp(2.1rem,6.8vw,5.75rem)] italic leading-[1.5] transition-[width] duration-200 ease-out"
          style={{ height: '1.5em', width: winW }}
        >
          <motion.span style={{ y }} className="flex flex-col">
            {reel.map((w, j) => (
              <span
                key={j}
                ref={j < SANS_WORDS.length ? (el) => { measure.current[j] = el; } : undefined}
                className="block whitespace-nowrap font-display text-[clamp(2.1rem,6.8vw,5.75rem)] italic leading-[1.5] tracking-[-0.01em] text-cream/55"
                style={{ height: '1.5em' }}
              >
                {w}
              </span>
            ))}
          </motion.span>
        </span>
      </span>
    </motion.div>
  );
}

/* ---------- Scène 4 — résolution : calme, Inter pour la respiration, net après le flou ---------- */
function SceneResolution({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const { p, opacity } = useScene(progress, i, true);
  const blur = useTransform(p, [0, 0.42], [10, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const y = useTransform(p, [0, 0.42], [36, 0]);

  return (
    <motion.div aria-hidden style={{ opacity }} className={sceneClass}>
      <motion.div style={{ filter, y }} className="max-w-[640px]">
        <span className="block font-display text-[clamp(2rem,6vw,4.5rem)] italic leading-[1.02] tracking-[-0.01em] text-ink">
          On fait <span className="text-terra">une seule chaussette</span>.
        </span>
        <p className="mx-auto mt-7 max-w-[460px] font-sans text-[15px] font-normal leading-[1.65] text-tabac md:text-base">
          Trois couleurs. Pas de collection capsule, pas de drop tous les mois.
          Si tu en veux deux, super, la livraison est offerte. Sinon, tant pis.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Fallback statique (reduced motion) ---------- */
function StaticManifesto(): ReactNode {
  return (
    <section aria-label="Manifeste" className="relative bg-terra text-cream">
      <div className="mx-auto max-w-[1200px] px-[5%] py-28 md:py-40">
        <ul className="space-y-1">
          {LINES.map((line) => (
            <li
              key={line}
              className="font-display text-[11vw] italic leading-[0.95] tracking-[-0.005em] md:text-[7vw]"
            >
              <span className="text-cream/40">Tant pis</span> {line}
              <span className="text-cream/50">.</span>
            </li>
          ))}
        </ul>
        <p className="mt-14 max-w-[520px] text-[0.95rem] leading-[1.65] text-cream/85 md:mt-20 md:text-base">
          On fait une seule chaussette pour l’instant. Trois couleurs. Pas de
          collection capsule, pas de drop tous les mois. Si tu en veux deux,
          super, la livraison est offerte. Sinon, tant pis.
        </p>
      </div>
    </section>
  );
}
