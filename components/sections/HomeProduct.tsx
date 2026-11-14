'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import { useUI } from '@/lib/ui-store';
import Magnetic from '@/components/Magnetic';
import type { Product } from '@/lib/products';

type ProductImageMap = Record<string, ReactNode>;

type HomeProductProps = {
  product: Product;
  /** Map of colorway-hex → server-rendered <PlaceholderImage /> */
  images: ProductImageMap;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HomeProduct({ product, images }: HomeProductProps) {
  const reduced = useReducedMotion();
  const [selectedHex, setSelectedHex] = useState(product.colorways[0].hex);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  const ctaRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  const selected =
    product.colorways.find((c) => c.hex === selectedHex) ?? product.colorways[0];

  const handleAdd = () => {
    add(
      {
        id: `${product.slug}-${selected.name.toLowerCase()}`,
        slug: product.slug,
        name: product.name,
        colorway: selected.name,
        hex: selected.hex,
        image: selected.image,
        price: product.price,
      },
      quantity
    );
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1800);
  };

  // Sticky buy-bar : visible quand le CTA principal est passé au-dessus de
  // l'écran, masquée dès que la section finale entre en vue.
  useEffect(() => {
    const cta = ctaRef.current;
    const finalEl = document.getElementById('final-cta-heading');
    if (!cta) return;

    let ctaPassed = false;
    let finalVisible = false;
    const sync = () => setShowBar(ctaPassed && !finalVisible);

    const ctaObs = new IntersectionObserver(
      ([e]) => {
        ctaPassed = !e.isIntersecting && e.boundingClientRect.top < 0;
        sync();
      },
      { threshold: 0 }
    );
    ctaObs.observe(cta);

    let finalObs: IntersectionObserver | undefined;
    if (finalEl) {
      finalObs = new IntersectionObserver(
        ([e]) => {
          // « atteinte » = visible OU déjà passée au-dessus → reste masquée
          // ensuite (footer compris), pas de réapparition en bas de page.
          finalVisible = e.isIntersecting || e.boundingClientRect.top < 0;
          sync();
        },
        { threshold: 0 }
      );
      finalObs.observe(finalEl);
    }

    return () => {
      ctaObs.disconnect();
      finalObs?.disconnect();
    };
  }, []);

  const totalLabel = quantity > 1 ? `${quantity} × ${product.price} €` : `${product.price} €`;

  return (
    <section
      id="produit"
      aria-labelledby="product-heading"
      className="bg-cream px-5 py-24 md:px-10 md:py-36"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 md:grid-cols-5 md:gap-16"
      >
        {/* Image — 60% (3/5) */}
        <div className="md:col-span-3">
          <div
            className="img-zoom relative w-full"
            style={{ backgroundColor: `${selected.hex}25` }}
            data-cursor="hover"
          >
            <motion.div
              key={selected.hex}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              {images[selected.hex] ?? images[product.colorways[0].hex]}
            </motion.div>
          </div>
        </div>

        {/* Info — 40% (2/5) */}
        <div className="md:col-span-2 md:pt-8">
          <h2
            id="product-heading"
            className="font-display text-5xl leading-[0.95] tracking-[-0.005em] text-ink md:text-7xl"
          >
            {product.name}
          </h2>
          <p className="mt-6 max-w-[520px] text-[0.98rem] leading-[1.65] text-tabac">
            {product.shortDescription}
          </p>

          {/* Colorway swatches */}
          <fieldset className="mt-10">
            <legend className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac">
              Couleur — <span className="text-ink">{selected.name}</span>
            </legend>
            <div className="mt-4 flex items-center gap-4">
              {product.colorways.map((c) => {
                const isActive = c.hex === selectedHex;
                return (
                  <motion.button
                    key={c.hex}
                    type="button"
                    onClick={() => setSelectedHex(c.hex)}
                    aria-label={c.name}
                    aria-pressed={isActive}
                    whileHover={reduced ? undefined : { scale: 1.12 }}
                    whileTap={reduced ? undefined : { scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className={[
                      'relative h-9 w-9 rounded-full border border-ink/10 transition-shadow duration-300',
                      isActive
                        ? 'ring-2 ring-ink ring-offset-4 ring-offset-cream'
                        : 'ring-0 hover:ring-2 hover:ring-ink/40 hover:ring-offset-4 hover:ring-offset-cream',
                    ].join(' ')}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </fieldset>

          {/* Quantité */}
          <fieldset className="mt-9">
            <legend className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac">
              Quantité
            </legend>
            <div className="mt-4 flex items-center gap-4">
              <QtyStepper value={quantity} onChange={setQuantity} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity >= 2 ? 'free' : 'nudge'}
                  initial={reduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="font-display text-[0.95rem] leading-tight text-ink"
                >
                  {quantity >= 2 ? (
                    <span className="inline-flex items-center gap-1.5">
                      Livraison offerte
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C2604A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-tabac">+1 paire = livraison offerte</span>
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
          </fieldset>

          {/* Prix + CTA */}
          <div className="mt-10 flex items-baseline gap-6">
            <p className="font-display text-4xl text-ink">{product.price}&nbsp;€</p>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-tabac">
              36 – 42
            </p>
          </div>

          <div ref={ctaRef} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* CTA — style unique : carré, terracotta, prix dans le bouton */}
            <Magnetic>
              <button
                type="button"
                onClick={handleAdd}
                className="group inline-flex items-center justify-center gap-3 bg-terra px-6 py-[14px] font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-ink"
              >
                <span>{added ? `Ajouté — ${totalLabel}` : `Je le prends — ${totalLabel}`}</span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </Magnetic>
            <Link
              href={`/produit/${product.slug}`}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-tabac underline-offset-4 transition-colors hover:text-terra hover:underline"
            >
              Tout savoir
            </Link>
          </div>

          <p className="mt-5 max-w-[520px] text-xs leading-[1.6] text-tabac">
            Taille unique 36–42 (oui, c’est large — on a un peu galéré aussi sur les premiers protos). Livraison offerte à partir de 2 paires.
          </p>
        </div>
      </motion.div>

      {/* Sticky buy-bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[70] border-t border-ink/12 bg-cream/95 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-3 md:px-10">
              <span
                aria-hidden
                className="hidden h-9 w-9 shrink-0 rounded-full border border-ink/10 sm:block"
                style={{ backgroundColor: selected.hex }}
              />
              <div className="hidden min-w-0 flex-col sm:flex">
                <span className="font-display text-lg leading-tight text-ink">
                  {product.name}
                </span>
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-tabac">
                  {selected.name} · 36–42
                </span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <QtyStepper value={quantity} onChange={setQuantity} />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="group inline-flex items-center justify-center gap-3 bg-terra px-5 py-[12px] font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-ink"
                >
                  <span className="whitespace-nowrap">Je le prends — {totalLabel}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function QtyStepper({
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
        className="h-10 w-10 text-tabac transition-colors hover:text-ink disabled:opacity-30"
      >
        −
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Augmenter la quantité"
        className="h-10 w-10 text-tabac transition-colors hover:text-ink"
      >
        +
      </button>
    </div>
  );
}
