'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart, type CartItem } from '@/lib/cart-store';
import { useUI } from '@/lib/ui-store';
import AnimatedPrice from '@/components/AnimatedPrice';

// Livraison offerte dès 2 paires (cf. ticker & branding).
const FREE_SHIPPING_QTY = 2;

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CartDrawer() {
  const reduced = useReducedMotion();
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);

  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Scroll lock + Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_QTY - count);
  const progress = Math.min(count / FREE_SHIPPING_QTY, 1);
  const empty = hydrated && items.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={close}
            aria-hidden
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[90] flex w-[92%] max-w-[440px] flex-col border-l border-ink/15 bg-cream shadow-[-24px_0_60px_-30px_rgba(42,24,16,0.35)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/12 px-6 py-5">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-tabac">
                Panier
                {hydrated && count > 0 && (
                  <span className="text-ink"> — {count}</span>
                )}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer le panier"
                className="inline-flex h-9 w-9 items-center justify-center text-tabac transition-colors hover:text-terra"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {empty ? (
              <EmptyState onClose={close} reduced={!!reduced} />
            ) : (
              <>
                {/* Barre livraison offerte */}
                <div className="border-b border-ink/12 px-6 py-5">
                  <p className="font-display text-[1.05rem] leading-tight text-ink">
                    {remaining === 0 ? (
                      <>Livraison offerte — c’est cadeau.</>
                    ) : (
                      <>
                        Plus que{' '}
                        <span className="text-terra">
                          {remaining} paire{remaining > 1 ? 's' : ''}
                        </span>{' '}
                        pour la livraison offerte.
                      </>
                    )}
                  </p>
                  <div className="mt-3 h-[3px] w-full overflow-hidden bg-ink/12">
                    <motion.div
                      className="h-full bg-terra"
                      initial={false}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                </div>

                {/* Items */}
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((item) => (
                      <DrawerLine
                        key={item.id}
                        item={item}
                        reduced={!!reduced}
                        onQty={(q) => setQuantity(item.id, q)}
                        onRemove={() => remove(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer */}
                <div className="border-t border-ink/12 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-tabac">
                      Sous-total
                    </span>
                    <span className="font-display text-2xl text-ink">
                      <AnimatedPrice value={subtotal} />
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac">
                    TVA incluse · livraison calculée au paiement
                  </p>

                  <CheckoutButton items={items} />

                  <Link
                    href="/panier"
                    onClick={close}
                    className="mt-3 block text-center font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-tabac underline-offset-4 transition-colors hover:text-terra hover:underline"
                  >
                    Voir le panier
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------- Empty ------------------------------- */

function EmptyState({
  onClose,
  reduced,
}: {
  onClose: () => void;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-1 flex-col items-center justify-center px-8 text-center"
    >
      <p className="font-display text-5xl text-ink">
        Vide<span className="text-terra">.</span>
      </p>
      <p className="mt-4 max-w-[260px] font-sans text-sm leading-[1.65] text-tabac">
        Rien pour l’instant. Tant pis — on n’a qu’une chaussette, mais elle est bien.
      </p>
      <Link
        href="/produit/la-grip-sock"
        onClick={onClose}
        className="group mt-8 inline-flex items-center gap-3 bg-terra px-6 py-[14px] font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-ink"
      >
        <span>La chaussette — 22 €</span>
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </motion.div>
  );
}

/* -------------------------------- Line -------------------------------- */

function DrawerLine({
  item,
  reduced,
  onQty,
  onRemove,
}: {
  item: CartItem;
  reduced: boolean;
  onQty: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <motion.li
      layout
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        transition: { duration: 0.35, ease: EASE },
      }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex gap-4 overflow-hidden border-b border-ink/10 py-5"
    >
      {/* Vignette coloris */}
      <div
        aria-hidden
        className="h-[72px] w-[60px] shrink-0 overflow-hidden"
        style={{ backgroundColor: `${item.hex}26` }}
      >
        <div className="h-full w-full" style={{ backgroundColor: item.hex, opacity: 0.85 }} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/produit/${item.slug}`}
            className="font-display text-lg leading-tight text-ink transition-colors hover:text-terra"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Retirer ${item.name} ${item.colorway}`}
            className="-mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center text-tabac/60 transition-colors hover:text-terra"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="mt-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-tabac">
          {item.colorway} · 36–42
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <Stepper value={item.quantity} onChange={onQty} />
          <p className="font-sans text-sm tabular-nums text-ink">
            <AnimatedPrice value={item.price * item.quantity} />
          </p>
        </div>
      </div>
    </motion.li>
  );
}

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (q: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-ink/20">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Diminuer la quantité"
        className="h-8 w-8 text-tabac transition-colors hover:text-ink disabled:opacity-30"
      >
        −
      </button>
      <span aria-live="polite" className="w-7 text-center text-sm tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Augmenter la quantité"
        className="h-8 w-8 text-tabac transition-colors hover:text-ink"
      >
        +
      </button>
    </div>
  );
}

/* ------------------------------ Checkout ------------------------------ */

function CheckoutButton({ items }: { items: CartItem[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Une erreur est survenue.');
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Paiement indisponible, réessaie dans un instant.'
      );
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onCheckout}
        disabled={loading || items.length === 0}
        className="mt-5 flex w-full items-center justify-center bg-ink py-[16px] font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-cream transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Spinner />
        ) : (
          <span className="inline-flex items-center gap-3">
            On passe au paiement
            <span aria-hidden>→</span>
          </span>
        )}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-xs leading-relaxed text-terra">
          {error}
        </p>
      )}
    </>
  );
}

function Spinner() {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}
