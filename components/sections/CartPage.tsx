'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { useCart, type CartItem } from '@/lib/cart-store';
import AnimatedPrice from '@/components/AnimatedPrice';

const FREE_SHIPPING_THRESHOLD = 44;
const STANDARD_SHIPPING = 4.9;

type CartPageProps = {
  expired?: boolean;
};

export default function CartPage({ expired = false }: CartPageProps) {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  useEffect(() => setHydrated(true), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping || items.length === 0 ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;
  const empty = hydrated && items.length === 0;

  return (
    <div className="bg-cream pt-28 md:pt-36">
      <div className="mx-auto max-w-[1200px] px-5 pb-24 md:px-10 md:pb-32">
        {expired && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border border-rouge/30 bg-rouge/10 px-5 py-4 text-sm text-rouge"
            role="alert"
          >
            Ta session a expiré, recommence ta commande.
          </motion.div>
        )}

        <header className="mb-12 md:mb-16">
          <h1 className="font-display italic text-4xl text-ink md:text-5xl">
            Ton panier
          </h1>
          <p className="mt-3 text-sm text-brown">
            {!hydrated
              ? ' '
              : itemCount === 0
              ? 'Aucun article'
              : `${itemCount} article${itemCount > 1 ? 's' : ''}`}
          </p>
        </header>

        {empty ? (
          <EmptyCart reduced={!!reduced} />
        ) : (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
            {/* LEFT — items (3/5 ≈ 60%) */}
            <section
              aria-label="Articles"
              className="md:col-span-3"
            >
              <ul>
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((item, i) => (
                    <CartLine
                      key={item.id}
                      item={item}
                      index={i}
                      reduced={!!reduced}
                      onQuantityChange={(q) => setQuantity(item.id, q)}
                      onRemove={() => remove(item.id)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </section>

            {/* RIGHT — summary (2/5 ≈ 40%) */}
            <aside
              aria-label="Récapitulatif"
              className="md:col-span-2"
            >
              <div className="md:sticky md:top-28">
                <Summary
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  freeShipping={freeShipping}
                  items={items}
                />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- Empty -------------------------------- */

function EmptyCart({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-md flex-col items-center py-20 text-center md:py-28"
    >
      <p className="font-display italic text-6xl text-ink md:text-7xl">
        Vide<span aria-hidden>.👄</span>
      </p>
      <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-ink/65">
        Tant pis — on en a d&apos;autres.
      </p>
      <Link
        href="/produit/la-grip-sock"
        className="group mt-10 inline-flex items-center gap-3 border border-rouge bg-rouge px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-cream hover:text-rouge"
      >
        <span>La chaussette</span>
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </motion.div>
  );
}

/* -------------------------------- Line -------------------------------- */

type CartLineProps = {
  item: CartItem;
  index: number;
  reduced: boolean;
  onQuantityChange: (q: number) => void;
  onRemove: () => void;
};

function CartLine({
  item,
  index,
  reduced,
  onQuantityChange,
  onRemove,
}: CartLineProps) {
  return (
    <motion.li
      layout
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.06 * index,
      }}
      className="overflow-hidden border-b border-ink/15"
    >
      <div className="flex items-start gap-5 py-6 md:items-center">
        {/* Image */}
        <div
          aria-hidden
          className="h-20 w-20 shrink-0 overflow-hidden bg-cream"
          style={{ backgroundColor: `${item.hex}30` }}
        >
          <div
            className="h-full w-full"
            style={{ backgroundColor: item.hex, opacity: 0.85 }}
          />
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            href={`/produit/${item.slug}`}
            className="font-display italic text-lg text-ink hover:text-rouge transition-colors"
          >
            {item.name}
          </Link>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/65">
            {item.colorway} · 36–42
          </p>

          {/* Mobile: qty + price below info */}
          <div className="mt-3 flex items-center justify-between gap-4 md:hidden">
            <QuantityStepper
              value={item.quantity}
              onChange={onQuantityChange}
            />
            <p className="text-[0.95rem] text-ink">
              <AnimatedPrice value={item.price * item.quantity} />
            </p>
          </div>
        </div>

        {/* Desktop: qty + price inline */}
        <div className="hidden items-center gap-8 md:flex">
          <QuantityStepper value={item.quantity} onChange={onQuantityChange} />
          <p className="w-20 text-right text-[0.95rem] text-ink">
            <AnimatedPrice value={item.price * item.quantity} />
          </p>
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Supprimer ${item.name} ${item.colorway}`}
          className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center text-ink/40 transition-colors hover:text-rouge"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </motion.li>
  );
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (q: number) => void;
}) {
  // 44×44 touch target on mobile (Apple HIG), compacted on desktop.
  const cell = 'h-11 w-11 md:h-9 md:w-9';
  return (
    <div className="inline-flex items-center border border-ink/20">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Diminuer la quantité"
        className={`${cell} text-ink/70 transition-colors hover:text-ink disabled:opacity-30`}
      >
        −
      </button>
      <span
        aria-live="polite"
        className="w-10 text-center text-sm tabular-nums text-ink md:w-8"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Augmenter la quantité"
        className={`${cell} text-ink/70 transition-colors hover:text-ink`}
      >
        +
      </button>
    </div>
  );
}

/* ------------------------------ Summary ------------------------------ */

type SummaryProps = {
  subtotal: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
  items: CartItem[];
};

function Summary({
  subtotal,
  shipping,
  total,
  freeShipping,
  items,
}: SummaryProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);

  // Subtle pulse after 30s of inactivity on a non-empty cart
  useEffect(() => {
    if (items.length === 0) return;
    const t = window.setTimeout(() => setNudge(true), 30_000);
    return () => window.clearTimeout(t);
  }, [items]);

  const onCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? 'Une erreur est survenue.');
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Impossible de lancer le paiement, réessaie dans un instant.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="border border-ink/15 bg-cream/60 p-6 backdrop-blur-md md:p-8">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ink/55">
        Récap
      </p>

      <dl className="mt-6 space-y-3 font-mono text-[0.85rem]">
        <div className="flex items-center justify-between">
          <dt className="text-ink/75">Sous-total</dt>
          <dd className="text-ink">
            <AnimatedPrice value={subtotal} />
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink/75">Livraison</dt>
          <dd className={freeShipping ? 'text-rouge' : 'text-ink'}>
            {freeShipping ? (
              <>Offerte <span aria-hidden>👄</span></>
            ) : (
              <AnimatedPrice value={shipping} alwaysShowDecimals />
            )}
          </dd>
        </div>
        {!freeShipping && (
          <p className="font-display italic text-xs leading-relaxed text-ink/65 normal-case tracking-normal">
            Tu prends une seconde paire&nbsp;? La livraison est offerte.
          </p>
        )}
      </dl>

      <div className="my-5 border-t border-ink/20" />

      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.85rem] text-ink">Total</span>
        <span className="font-display italic text-2xl text-ink">
          <AnimatedPrice value={total} />
        </span>
      </div>
      <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink/50">
        TVA incluse
      </p>

      <motion.button
        type="button"
        onClick={onCheckout}
        disabled={loading || items.length === 0}
        animate={
          nudge && !loading
            ? { scale: [1, 1.015, 1] }
            : { scale: 1 }
        }
        transition={
          nudge && !loading
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        className="mt-7 flex h-14 w-full items-center justify-center bg-ink font-mono text-[0.78rem] uppercase tracking-[0.22em] text-cream transition-opacity duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Spinner />
        ) : (
          <span className="inline-flex items-center gap-3">
            On y va
            <span aria-hidden>→</span>
          </span>
        )}
      </motion.button>

      {error && (
        <p
          role="alert"
          className="mt-3 text-xs leading-relaxed text-rouge"
        >
          {error}
        </p>
      )}

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/55">
        <li className="inline-flex items-center gap-1.5">
          <LockIcon />
          Stripe
        </li>
        <li className="inline-flex items-center gap-1.5">
          <ReturnIcon />
          Retours 30 j
        </li>
        <li className="inline-flex items-center gap-1.5">
          <BoxIcon />
          3–5 j
        </li>
      </ul>
    </div>
  );
}

/* -------------------------------- SVG -------------------------------- */

function Spinner() {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
      <path d="M3.5 7.5 12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}
