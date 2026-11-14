'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const VISIBLE = 4; // 3 cartes "principales" + 1 qui peek en bas = pile iOS
const CYCLE_MS = 8_000;
const COUNTER_TARGET = 247;

const CARD_H = 130;
const GAP = 14;
const PEEK = 12; // px de la 4e carte qui dépassent sous la 3e

type Review = {
  handle: string;
  location: string;
  body: string;
};

// TODO: remplacer par vrais avis (UGC TikTok / clientes) quand on en a
const POOL: Review[] = [
  {
    handle: '@lou_pilates',
    location: 'Paris 11e',
    body: 'J’ai testé sur 4 cours de Reformer cette semaine. Zero glissade. Et la couleur terra va avec littéralement tout.',
  },
  {
    handle: '@camille.studio',
    location: 'Lyon',
    body: 'Je portais des Bombas que je commandais aux US. Là c’est aussi bien, en France, à 25 €. Tant pis pour Bombas.',
  },
  {
    handle: '@inès.k',
    location: 'Marseille',
    body: 'Mises trois fois cette semaine — studio, maison, brunch. Personne n’a capté que c’est des chaussettes de Pilates.',
  },
  {
    handle: '@sasha.yoga',
    location: 'Bordeaux',
    body: 'Mon prof de yoga m’a demandé où je les ai trouvées. J’ai dit nulle part. Tant pis pour elle.',
  },
  {
    handle: '@manon.r',
    location: 'Paris 18e',
    body: 'On m’a arrêtée dans la rue pour me demander la marque. Genre dans la rue.',
  },
  {
    handle: '@clo.kine',
    location: 'Nantes',
    body: 'Ma kiné les a kiffées. Elle bosse 9 h sur sol carrelé. Elle a pris les 3 couleurs le soir même.',
  },
  {
    handle: '@julie.danse',
    location: 'Toulouse',
    body: 'C’est moche à dire mais je les mets aussi pour traîner. Elles tiennent niquel.',
  },
  {
    handle: '@margaux.b',
    location: 'Paris 9e',
    body: 'Premier achat où je regrette pas d’avoir cédé. Voilà voilà.',
  },
  {
    handle: '@léa.studios',
    location: 'Strasbourg',
    body: 'On a refait notre stock studio. Les filles arrêtent de chouiner sur les glissades. Merci.',
  },
  {
    handle: '@noé.fit',
    location: 'Aix',
    body: 'Acheté en Barranco. Bon, j’ai commandé les 2 autres deux jours après. Tant pis.',
  },
];

const POSITION_TIMESTAMPS = ['maintenant', 'il y a 2 min', 'il y a 11 min'];

// Position absolue (top) en px selon la slot du stack.
// 0–2 : visibles normalement. 3 : derrière la 3e, ne montre que `PEEK` px en bas.
function positionTop(index: number): number {
  if (index <= 2) return index * (CARD_H + GAP);
  return 2 * (CARD_H + GAP) + PEEK;
}

const CONTAINER_H = positionTop(VISIBLE - 1) + CARD_H; // 300 + 130 = 430

export default function HomeReviews() {
  const reduced = !!useReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stackRef, { amount: 0.3 });
  const [startIdx, setStartIdx] = useState(0);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (inView && !armed) setArmed(true);
  }, [inView, armed]);

  useEffect(() => {
    if (!armed || reduced || !inView) return;
    const id = window.setInterval(() => {
      setStartIdx((i) => (i + 1) % POOL.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [armed, reduced, inView]);

  const visible = armed
    ? Array.from({ length: VISIBLE }, (_, k) => {
        const idx = (startIdx - k + POOL.length * 100) % POOL.length;
        return POOL[idx];
      })
    : [];

  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative bg-cream py-24 md:py-32"
    >
      {/* glow tabac discret au centre — nourrit le backdrop-filter blur des cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 40%, rgba(122,79,58,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1300px] px-5 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <h2
            id="reviews-heading"
            className="font-display text-4xl leading-[1] tracking-[-0.005em] text-ink md:text-6xl"
          >
            On nous écrit des trucs
            <br className="hidden md:block" /> assez gentils.
          </h2>
          <Counter target={COUNTER_TARGET} reduced={reduced} />
        </motion.div>

        {/* feed : 4 cartes en absolute dans un container de hauteur fixe.
            La 4e est en arrière-plan, ne peek que `PEEK` px en bas — c'est elle
            qui matérialise la « pile iOS ». Quand un cycle arrive, la 3e
            descend pour devenir la 4e (s'enfonce dans la pile), la 4e sort. */}
        <div
          ref={stackRef}
          className="relative mx-auto mt-12 max-w-[620px] md:mt-16"
          style={{ height: `${CONTAINER_H}px` }}
        >
          <AnimatePresence mode="popLayout" initial>
            {visible.map((r, i) => (
              <NotifCard
                key={r.handle}
                review={r}
                index={i}
                timestamp={POSITION_TIMESTAMPS[i] ?? 'plus tôt'}
                reduced={reduced}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* champ texte iOS-Messages — laisse un avis. Pill liquidglass +
            bouton terra à droite, kiss stamp à l'envoi. */}
        <ReviewInput reduced={reduced} />
      </div>
    </section>
  );
}

function Counter({ target, reduced }: { target: number; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const startTime = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  return (
    <div
      ref={ref}
      className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac md:text-[11px]"
    >
      <span className="text-ink tabular-nums">{value}</span>{' '}
      filles ont craqué cette semaine
    </div>
  );
}

/**
 * Carte notif iPhone — toutes les cartes (0–3) partagent la même structure et
 * sont positionnées absolument selon leur `index` dans le stack.
 *  — Index 0–2 : visibles, full opacity, full scale, padding normal.
 *  — Index 3   : décalée derrière la 3e (z-index inférieur), légère opacity
 *                réduite + scaleX 0.96 → on n'en voit que les `PEEK` px en bas.
 *  — Cycle : chaque carte anime son y/opacity/scale vers les valeurs de son
 *    nouvel index. La carte qui passe de 2 → 3 « entre » dans la pile (c'est
 *    l'effet d'absorption que tu voulais). La carte qui était en 3 exit (fade).
 *  — Fond réellement blurry via backdrop-filter (nourri par le glow tabac de
 *    la section).
 *  — Clic = bisou terra au coin (anim 0.8 s).
 */
// forwardRef : AnimatePresence mode="popLayout" doit mesurer la carte sortante.
const NotifCard = forwardRef<
  HTMLElement,
  { review: Review; index: number; timestamp: string; reduced: boolean }
>(function NotifCard({ review, index, timestamp, reduced }, ref) {
  const [stampKey, setStampKey] = useState(0);
  const targetY = positionTop(index);
  const isStacked = index >= 3;

  const fireStamp = () => {
    if (reduced || isStacked) return;
    setStampKey((k) => k + 1);
  };

  return (
    <motion.article
      ref={ref}
      initial={
        reduced
          ? false
          : {
              opacity: 0,
              y: targetY - 30,
              scale: 1,
            }
      }
      animate={{
        opacity: isStacked ? 0.75 : 1,
        y: targetY,
        scale: isStacked ? 0.96 : 1,
      }}
      exit={
        reduced
          ? undefined
          : {
              opacity: 0,
              y: targetY + 22,
              scale: 0.88,
              transition: { duration: 0.5, ease: EASE },
            }
      }
      transition={{
        duration: 0.55,
        ease: EASE,
        delay: reduced ? 0 : 0.08 * index,
      }}
      onClick={fireStamp}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isStacked) {
          e.preventDefault();
          fireStamp();
        }
      }}
      tabIndex={isStacked ? -1 : 0}
      role={isStacked ? undefined : 'button'}
      aria-label={
        isStacked ? undefined : `Aimer le témoignage de ${review.handle}`
      }
      aria-hidden={isStacked || undefined}
      className={`absolute inset-x-0 top-0 rounded-[18px] border-t-[0.5px] border-white/55 px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-terra/40 md:px-6 ${
        isStacked ? 'cursor-default' : 'cursor-pointer'
      }`}
      style={{
        height: `${CARD_H}px`,
        zIndex: 40 - index * 10,
        transformOrigin: 'bottom center',
        backgroundImage:
          'linear-gradient(180deg, rgba(255,250,242,0.62), rgba(242,232,220,0.42))',
        boxShadow:
          '0 6px 22px rgba(42,24,16,0.06), 0 1px 2px rgba(42,24,16,0.04)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-terra"
        />
        <span className="min-w-0 truncate font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac md:text-[11px]">
          {review.handle} · {review.location}
        </span>
        <span className="ml-auto shrink-0 whitespace-nowrap font-sans text-[10px] text-tabac/70 md:text-[11px]">
          {timestamp}
        </span>
      </div>

      <blockquote className="mt-2.5 line-clamp-2 font-display text-[1.1rem] italic leading-snug text-ink md:text-[1.25rem]">
        {review.body}
      </blockquote>

      <AnimatePresence>
        {stampKey > 0 && (
          <motion.span
            key={stampKey}
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-3"
            initial={{ opacity: 0, scale: 0.4, rotate: -28 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1.15, 1, 0.95],
              rotate: 10,
            }}
            transition={{
              duration: 0.8,
              ease: EASE,
              times: [0, 0.22, 0.7, 1],
            }}
          >
            <LipsTerra className="block h-8 w-9 md:h-9 md:w-10" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.article>
  );
});

/**
 * Champ texte « iMessage-like » pour laisser un avis. Pill rounded, fake
 * liquidglass cohérent avec les notif cards. Bouton terra à droite, qui passe
 * en désactivé quand le champ est vide (comme le send d'iOS). Après envoi :
 * bisou flash + placeholder qui devient « merci, on a lu. » pendant ~2.4 s.
 * Mocked en local pour l'instant (pas de backend) — le submit est juste un
 * feedback visuel.
 */
function ReviewInput({ reduced }: { reduced: boolean }) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [stampKey, setStampKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const hasText = text.trim().length > 0;

  // submit du iMessage → ouvre la modale iPhone avec le body pré-rempli
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasText || sent) return;
    setModalOpen(true);
  };

  // submit de la modale → flash + reset + on garde le « merci » 2.4 s
  const onModalSubmit = () => {
    setModalOpen(false);
    setSent(true);
    if (!reduced) setStampKey((k) => k + 1);
    setText('');
    window.setTimeout(() => setSent(false), 2400);
  };

  return (
    <>
    <motion.form
      onSubmit={onSubmit}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
      className="relative mx-auto mt-6 max-w-[620px] md:mt-8"
    >
      <div
        className="relative flex items-center gap-2 rounded-full border-t-[0.5px] border-white/55 py-1.5 pl-5 pr-1.5"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(255,250,242,0.62), rgba(242,232,220,0.42))',
          boxShadow:
            '0 4px 16px rgba(42,24,16,0.06), 0 1px 2px rgba(42,24,16,0.04)',
          backdropFilter: 'blur(16px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={sent ? 'merci, on a lu.' : 'psst, laisse-nous un avis.'}
          maxLength={280}
          disabled={sent}
          aria-label="Laisser un avis"
          className="flex-1 bg-transparent font-display text-[1.1rem] italic leading-snug text-ink placeholder:text-tabac/55 outline-none md:text-[1.25rem]"
        />
        <button
          type="submit"
          aria-label="Envoyer le témoignage"
          disabled={!hasText || sent}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-200 ${
            hasText && !sent
              ? 'bg-terra text-cream hover:scale-105 active:scale-95'
              : 'cursor-default bg-tabac/15 text-tabac/40'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        {/* bisou flash après envoi */}
        <AnimatePresence>
          {stampKey > 0 && (
            <motion.span
              key={stampKey}
              aria-hidden
              className="pointer-events-none absolute -top-3 right-1"
              initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1.15, 1, 0.95],
                rotate: 10,
              }}
              transition={{
                duration: 0.85,
                ease: EASE,
                times: [0, 0.22, 0.7, 1],
              }}
            >
              <LipsTerra className="block h-8 w-9" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.form>

    <AnimatePresence>
      {modalOpen && (
        <ReviewModal
          initialBody={text}
          onClose={() => setModalOpen(false)}
          onSubmit={onModalSubmit}
          reduced={reduced}
        />
      )}
    </AnimatePresence>
    </>
  );
}

/**
 * Modale iPhone-mockup pour laisser un avis. Champ nom, body (pré-rempli depuis
 * le iMessage en dessous), email (optionnel). Submit = CTA Tant Pis carré
 * « Laisser mon avis ». Close via X, Escape ou clic sur l'overlay.
 */
function ReviewModal({
  initialBody,
  onClose,
  onSubmit,
  reduced,
}: {
  initialBody: string;
  onClose: () => void;
  onSubmit: () => void;
  reduced: boolean;
}) {
  const [name, setName] = useState('');
  const [body, setBody] = useState(initialBody);
  const [email, setEmail] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  const canSubmit = name.trim().length > 0 && body.trim().length > 0;

  // Esc → close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // bloque le scroll du body sous la modale
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // focus le 1er champ après l'anim d'entrée
  useEffect(() => {
    const t = window.setTimeout(() => nameRef.current?.focus(), 220);
    return () => window.clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: brancher backend / Stripe / email
    // eslint-disable-next-line no-console
    console.log('avis soumis', { name, body, email });
    onSubmit();
  };

  const inputBg = { background: 'rgba(122,79,58,0.07)' };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-sm"
      />

      <motion.div
        initial={reduced ? false : { scale: 0.93, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reduced ? undefined : { scale: 0.94, y: 12, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative w-full max-w-[360px] rounded-[48px] bg-ink p-1.5"
        style={{
          height: 'min(740px, 88vh)',
          boxShadow:
            '0 32px 64px -16px rgba(42,24,16,0.45), 0 4px 8px rgba(42,24,16,0.1)',
        }}
      >
        <div className="relative h-full overflow-hidden rounded-[42px] bg-cream">
          {/* dynamic island — absolute, centré */}
          <div
            aria-hidden
            className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-ink"
          />

          <form
            onSubmit={handleSubmit}
            className="h-full overflow-y-auto px-6 pb-14 pt-14"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 pt-1">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac">
                  Tant Pis · Avis
                </p>
                <h3
                  id="review-modal-title"
                  className="mt-1 font-display text-[2rem] italic leading-[1.05] text-ink md:text-[2.4rem]"
                >
                  Ton avis.
                </h3>
                <p className="mt-1.5 font-sans text-[11px] text-tabac">
                  On le lit, on en publie certains.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tabac/10 text-tabac transition-colors hover:bg-tabac/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <Field label="Ton prénom">
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="lou"
                  maxLength={40}
                  required
                  className="w-full rounded-xl border-none px-4 py-3 font-sans text-[15px] text-ink placeholder:text-tabac/45 outline-none focus:ring-2 focus:ring-terra/40"
                  style={inputBg}
                />
              </Field>

              <Field label="Ton avis">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="raconte…"
                  rows={4}
                  maxLength={280}
                  required
                  className="w-full resize-none rounded-xl border-none px-4 py-3 font-sans text-[15px] leading-snug text-ink placeholder:text-tabac/45 outline-none focus:ring-2 focus:ring-terra/40"
                  style={inputBg}
                />
              </Field>

              <Field label="Ton email" hint="facultatif">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="(au cas où on te répond)"
                  maxLength={120}
                  className="w-full rounded-xl border-none px-4 py-3 font-sans text-[15px] text-ink placeholder:text-tabac/45 outline-none focus:ring-2 focus:ring-terra/40"
                  style={inputBg}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 bg-terra px-7 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-ink disabled:cursor-default disabled:opacity-40"
            >
              Laisser mon avis
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </button>

          </form>

          {/* fade en bas pour masquer le contenu qui scroll derrière le
              home indicator */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-cream via-cream/85 to-transparent"
          />

          {/* home indicator — pinned en bas du téléphone */}
          <div
            aria-hidden
            className="absolute left-1/2 bottom-2.5 z-20 h-1 w-32 -translate-x-1/2 rounded-full bg-tabac/35"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Field iOS-like : label caps + hint optionnel au-dessus, input/textarea fourni. */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac">
          {label}
        </span>
        {hint && (
          <span className="font-sans text-[10px] lowercase italic text-tabac/55">
            — {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

function LipsTerra({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      <svg
        viewBox="0 0 36 32"
        className="block h-full w-full rotate-[14deg]"
        fill="#C2604A"
        aria-hidden
      >
        <path d="M4 14 C8 6 14 6 18 11 C22 6 28 6 32 14 C27.5 12 22 13 18 13.8 C14 13 8.5 12 4 14 Z" />
        <path d="M5 15 C13 16.4 23 16.4 31 15 C26 27 10 27 5 15 Z" />
      </svg>
    </span>
  );
}
