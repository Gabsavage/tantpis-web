'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { BisouMark, BISOU_PRESETS } from '@/components/Logo';

const EASE = [0.22, 1, 0.36, 1] as const;
// Le point (bisou) entre après les lettres ; le header apparaît au même moment
// (même délai côté Header.tsx — garder les deux synchros).
const POINT_DELAY = 1.25;
// Hauteur de scroll de la section (pin). > 100svh = il reste du scroll pour
// jouer la réduction du titre avant de passer à la suite.
const HERO_VH = 150;

/**
 * Hero d'arrivée. On ne voit d'abord QUE « Tant Pis. » en crème sur une vidéo
 * plein écran (placeholder). La section est épinglée : au scroll, le titre
 * rétrécit et remonte vers la place du logo du header (centré), puis s'efface
 * pendant que le header + le marquee apparaissent (handoff). Fallback statique
 * si reduced-motion.
 */
export default function HomeHero() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Une fois l'intro du point jouée (lèvre → point), on bascule sur BisouMark
  // qui rétablit le morph au survol (le point final est identique → sans saut).
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), (POINT_DELAY + 1) * 1000 + 100);
    return () => clearTimeout(t);
  }, []);

  // Anti-flash : on garde le poster affiché tant que la vidéo n'est pas prête
  // (event canplay) ; aucun fond marron n'apparaît avant la vidéo.
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    const v = videoRef.current;
    // Si la vidéo est déjà bufferisée (cache), on bascule tout de suite.
    if (v && v.readyState >= 3) setVideoReady(true);
  }, []);

  // Au (re)chargement de la home, on repart du haut pour rejouer l'intro —
  // on neutralise la restauration de scroll du navigateur.
  useEffect(() => {
    const prev = history.scrollRestoration;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return () => {
      if ('scrollRestoration' in history) history.scrollRestoration = prev;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.26], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0, 0.6], ['0vh', '-46vh'], { clamp: true });
  const titleOpacity = useTransform(scrollYProgress, [0.55, 0.78], [1, 0], { clamp: true });

  return (
    <section
      ref={section}
      id="hero"
      aria-label="Présentation"
      className="relative bg-ink"
      style={{ height: reduced ? '100svh' : `${HERO_VH}svh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* VIDÉO de fond */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
        >
          {/* HEVC d'abord (Safari, plus léger), H.264 en fallback (Chrome/Firefox) */}
          <source src="/videos/hero.mp4" type='video/mp4; codecs="hvc1"' />
          <source src="/videos/hero-h264.mp4" type="video/mp4" />
        </video>

        {/* Calque anti-flash — affiche le poster tant que la vidéo n'est pas
            prête ; se retire en fondu une fois la vidéo jouable. Jamais de fond
            marron : si la vidéo ne charge pas, le poster reste. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: videoReady ? 0 : 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-poster.jpg)' }}
        />

        {/* voile pour le contraste du titre crème */}
        <div aria-hidden className="absolute inset-0 bg-ink/40" />

        {/* TITRE + CTA — plein écran à l'arrivée, rétrécit vers le header au scroll
            (le wrapper porte les transforms pour que les deux scalent ensemble) */}
        <motion.div
          style={reduced ? undefined : { scale: titleScale, y: titleY, opacity: titleOpacity }}
          className="relative z-10 flex flex-col items-center gap-2 md:gap-4"
        >
          <h1 className="group origin-center whitespace-nowrap px-[5%] text-center font-display text-[clamp(2.75rem,15vw,11rem)] leading-[0.9] tracking-[-0.02em] text-cream">
            <Word text="Tant Pis" reduced={!!reduced} />
            {reduced || introDone ? (
              <BisouMark size="compact" />
            ) : (
              <IntroBisou delay={POINT_DELAY} />
            )}
            <span className="sr-only">Tant Pis.</span>
          </h1>
          <HeroCTA reduced={!!reduced} />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Apparition du point en mode « bisou » : la lèvre apparaît (avec un petit cœur
 * lancé), puis se transforme en point — état final. Joué une fois à l'entrée.
 */
function IntroBisou({ delay }: { delay: number }) {
  return (
    <span className={`relative inline-block align-baseline ${BISOU_PRESETS.compact}`}>
      {/* lèvres — apparaissent (le bisou) puis se replient */}
      <motion.span
        aria-hidden
        className="absolute inset-0 origin-center"
        initial={{ scale: 0, opacity: 0, rotate: 14 }}
        animate={{ scale: [0, 1, 1, 0.2], opacity: [0, 1, 1, 0], rotate: 14 }}
        transition={{ duration: 1, delay, times: [0, 0.32, 0.62, 1], ease: EASE }}
      >
        <svg viewBox="0 0 36 32" className="block h-full w-full" fill="#C2604A">
          <path d="M4 14 C8 6 14 6 18 11 C22 6 28 6 32 14 C27.5 12 22 13 18 13.8 C14 13 8.5 12 4 14 Z" />
          <path d="M5 15 C13 16.4 23 16.4 31 15 C26 27 10 27 5 15 Z" />
        </svg>
      </motion.span>

      {/* le cœur qui s'envole pendant le bisou */}
      <motion.svg
        aria-hidden
        viewBox="0 0 32 32"
        className="pointer-events-none absolute inset-0 block h-full w-full"
        fill="#C2604A"
        initial={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 14 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.3, 1, 0.55],
          x: ['0em', '0.05em', '0.26em'],
          y: ['0em', '-0.16em', '-0.52em'],
          rotate: 14,
        }}
        transition={{ duration: 0.7, delay: delay + 0.28, times: [0, 0.35, 1], ease: EASE }}
      >
        <path d="M16 24 C16 24 8 19 8 13.5 C8 10.5 10.3 9 12.5 9 C14 9 15.4 10 16 11.2 C16.6 10 18 9 19.5 9 C21.7 9 24 10.5 24 13.5 C24 19 16 24 16 24 Z" />
      </motion.svg>

      {/* le point — état final, prend la place de la lèvre */}
      <motion.span
        aria-hidden
        className="absolute inset-0"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0, 1], opacity: [0, 0, 1] }}
        transition={{ duration: 1, delay, times: [0, 0.62, 1], ease: EASE }}
      >
        <svg viewBox="0 0 36 32" className="block h-full w-full" fill="#C2604A">
          <circle cx="18" cy="17" r="5.5" />
        </svg>
      </motion.span>
    </span>
  );
}

/**
 * CTA « tampon » du hero. Pas un vrai bouton terra plein — l'aesthetic c'est
 * un tampon encreur légèrement de travers : 1.5px border crème, bg presque
 * transparent, rotation -2.5°, Inter caps. Au hover il se "presse" (scale +
 * rotation qui se redresse). Au clic le bisou terra s'imprime au coin sup-droit,
 * comme une signature de marque (kiss = tampon = brand mark).
 */
function HeroCTA({ reduced }: { reduced: boolean }) {
  const [stampKey, setStampKey] = useState(0);
  // une fois l'anim "tampon" jouée, on fige animate sur la valeur finale —
  // sinon framer reinterpole les keyframes [1.35, 0.92, 1.04, 1] au retour
  // du hover, ce qui produit un pop visuel bizarre.
  const [entered, setEntered] = useState(reduced);

  const fireStamp = () => {
    if (!reduced) setStampKey((k) => k + 1);
  };

  return (
    <motion.a
      href="#produit"
      onClick={fireStamp}
      initial={reduced ? false : { opacity: 0, scale: 1.35, y: -8 }}
      animate={
        reduced
          ? undefined
          : entered
            ? { opacity: 1, scale: 1, y: 0 }
            : {
                opacity: [0, 1, 1, 1],
                scale: [1.35, 0.92, 1.04, 1],
                y: [-8, 0, 0, 0],
                transition: {
                  duration: 0.5,
                  ease: EASE,
                  times: [0, 0.3, 0.65, 1],
                  delay: POINT_DELAY + 0.95,
                },
              }
      }
      onAnimationComplete={() => {
        if (!entered) setEntered(true);
      }}
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.04,
              transition: { duration: 0.25, ease: EASE },
            }
      }
      whileTap={
        reduced
          ? undefined
          : { scale: 0.97, transition: { duration: 0.12, ease: EASE } }
      }
      className="group/cta relative inline-flex items-center gap-2.5 border-[1.5px] border-cream/85 bg-cream/[0.05] px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-cream"
    >
      On regarde
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover/cta:translate-x-1"
      >
        →
      </span>

      {/* bisou terra qui s'imprime au coin au clic */}
      <AnimatePresence>
        {stampKey > 0 && (
          <motion.span
            key={stampKey}
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-5"
            initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1.15, 1, 0.95],
              rotate: 10,
            }}
            transition={{
              duration: 0.75,
              ease: EASE,
              times: [0, 0.22, 0.7, 1],
            }}
          >
            <svg
              viewBox="0 0 36 32"
              className="block h-9 w-10 rotate-[14deg]"
              fill="#C2604A"
              aria-hidden
            >
              <path d="M4 14 C8 6 14 6 18 11 C22 6 28 6 32 14 C27.5 12 22 13 18 13.8 C14 13 8.5 12 4 14 Z" />
              <path d="M5 15 C13 16.4 23 16.4 31 15 C26 27 10 27 5 15 Z" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

/** Chaque lettre monte amplement en stagger au chargement. */
function Word({ text, reduced }: { text: string; reduced: boolean }) {
  return (
    <motion.span
      aria-hidden
      initial={reduced ? 'show' : 'hidden'}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
      }}
      className="inline-flex"
    >
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: '0.6em' },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.9, ease: EASE }}
          className="inline-block"
          style={{ whiteSpace: 'pre' }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
