'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import Accordion from '@/components/Accordion';
import type { Product } from '@/lib/products';

type ImageMap = Record<string, ReactNode>;

type ProductDetailProps = {
  product: Product;
  /** Map keyed by colorway.hex of server-rendered main gallery images. */
  galleryImages: ImageMap;
  /** Three small lifestyle thumbnails for the bottom section. */
  lifestyleImages: ReactNode[];
};

const FADE_IN = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ProductDetail({
  product,
  galleryImages,
  lifestyleImages,
}: ProductDetailProps) {
  const reduced = useReducedMotion();
  const [selectedHex, setSelectedHex] = useState(product.colorways[0].hex);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const selected =
    product.colorways.find((c) => c.hex === selectedHex) ??
    product.colorways[0];

  const handleAdd = () => {
    add({
      id: `${product.slug}-${selected.name.toLowerCase()}`,
      slug: product.slug,
      name: product.name,
      colorway: selected.name,
      hex: selected.hex,
      image: selected.image,
      price: product.price,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const stagger = (i: number) => ({
    initial: reduced ? false : FADE_IN.hidden,
    animate: FADE_IN.show,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.1 + i * 0.08,
    },
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* LEFT — gallery */}
        <div className="md:sticky md:top-0 md:h-screen">
          {/* DESKTOP: single image with tinted background */}
          <motion.div
            animate={{ backgroundColor: `${selected.hex}26` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative hidden h-full w-full md:flex md:items-center md:justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.hex}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="h-full w-full [&>div]:h-full [&>div]:!aspect-auto">
                  {galleryImages[selected.hex]}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating thumbnails (bottom-left overlay) */}
            <div className="pointer-events-auto absolute bottom-6 left-6 z-10 flex gap-3 rounded-full bg-cream/80 p-2 backdrop-blur-md">
              {product.colorways.map((c) => {
                const isActive = c.hex === selectedHex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setSelectedHex(c.hex)}
                    aria-label={`Voir le coloris ${c.name}`}
                    aria-pressed={isActive}
                    className={[
                      'h-8 w-8 rounded-full border border-ink/10 transition-shadow duration-300',
                      isActive
                        ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream/80'
                        : 'hover:ring-2 hover:ring-ink/30 hover:ring-offset-2 hover:ring-offset-cream/80',
                    ].join(' ')}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* MOBILE: horizontal snap carousel */}
          <motion.div
            animate={{ backgroundColor: `${selected.hex}26` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="md:hidden"
          >
            <ul
              className="flex w-full snap-x snap-mandatory overflow-x-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onScroll={(e) => {
                const el = e.currentTarget;
                const i = Math.round(el.scrollLeft / el.clientWidth);
                const c = product.colorways[i];
                if (c && c.hex !== selectedHex) setSelectedHex(c.hex);
              }}
            >
              {product.colorways.map((c) => (
                <li
                  key={c.hex}
                  className="w-full shrink-0 snap-center"
                  style={{ flex: '0 0 100%' }}
                >
                  {galleryImages[c.hex]}
                </li>
              ))}
            </ul>
            {/* dots */}
            <div className="flex justify-center gap-2 py-4">
              {product.colorways.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  aria-label={`Voir le coloris ${c.name}`}
                  onClick={() => setSelectedHex(c.hex)}
                  className={[
                    'h-1.5 rounded-full transition-all duration-300',
                    c.hex === selectedHex ? 'w-6 bg-ink' : 'w-1.5 bg-ink/30',
                  ].join(' ')}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT — info */}
        <div className="px-6 pb-32 pt-12 md:px-16 md:pb-32 md:pt-24">
          <motion.nav
            aria-label="Fil d'Ariane"
            {...stagger(0)}
            className="text-[0.72rem] text-brown/70"
          >
            <Link href="/" className="hover:text-brown">
              Accueil
            </Link>{' '}
            / <span className="text-brown">{product.name}</span>
          </motion.nav>

          <motion.h1
            {...stagger(1)}
            className="font-display italic mt-6 text-5xl leading-[0.95] tracking-tight text-ink md:text-6xl"
          >
            {product.name}
          </motion.h1>

          <motion.div {...stagger(2)} className="mt-6">
            <p className="font-display italic text-2xl text-ink">
              <span className="font-mono not-italic">{product.price}</span>&nbsp;€
            </p>
            <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink/55">
              Livraison offerte ≥ 2 paires · Retours 30 jours
            </p>
          </motion.div>

          <motion.div {...stagger(3)} className="my-10 border-t border-ink/20" />

          {/* Colorway selector */}
          <motion.fieldset {...stagger(4)}>
            <legend className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
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
                      'h-7 w-7 rounded-full border border-ink/10 transition-shadow duration-300',
                      isActive
                        ? 'ring-2 ring-ink ring-offset-4 ring-offset-cream'
                        : 'hover:ring-2 hover:ring-ink/40 hover:ring-offset-4 hover:ring-offset-cream',
                    ].join(' ')}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </motion.fieldset>

          {/* Size */}
          <motion.fieldset {...stagger(5)} className="mt-10">
            <legend className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
              Taille
            </legend>
            <div className="mt-4 flex items-center gap-3">
              <span
                aria-pressed="true"
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-cream"
              >
                36 – 42
              </span>
              <span className="font-display italic text-sm text-ink/65">
                Une seule. On galère aussi sur les premiers stocks.
              </span>
            </div>
          </motion.fieldset>

          {/* ATC */}
          <motion.div {...stagger(6)} className="mt-10">
            <AtcButton
              added={added}
              onClick={handleAdd}
              price={product.price}
            />
          </motion.div>

          <div className="my-12 border-t border-ink/20" />

          {/* Long description */}
          <motion.section {...stagger(7)}>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
              Ce que c’est
            </p>
            <p className="mt-5 text-[0.98rem] leading-[1.8] text-ink/85">
              {product.longDescription}
            </p>
          </motion.section>

          {/* Accordions */}
          <motion.div {...stagger(8)} className="mt-12">
            <Accordion title="Matière">
              {product.composition}. Le coton est peigné fil long (Supima) — celui qui boulotte pas après quelques lavages.
            </Accordion>
            <Accordion title="Grip">
              {product.grip}. Testé sur Reformer, tapis et parquet de studio. Tient.
            </Accordion>
            <Accordion title="Entretien">
              Machine 30°, à l’envers. Pas de sèche-linge — t’as quand même un compte Vinted, c’est pas la peine de cramer tes chaussettes.
            </Accordion>
            <Accordion title="Livraison & retours">
              France métropolitaine : 4,90 € pour une paire, gratuite à partir de deux. Retours sous 30 jours, produit non porté (on est pas dingues).
            </Accordion>
            <Accordion title="Fabrication">
              Designé à Paris 11e. Tricoté à Vila Nova de Famalicão, au Portugal — la même région qui fabrique pour pas mal de marques qu’on aime bien. 9 prototypes avant celle-là.
            </Accordion>
          </motion.div>

          {/* Lifestyle gallery */}
          <motion.section {...stagger(9)} className="mt-20">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
                Portées
              </p>
              <a
                href="https://www.instagram.com/tantpis"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink/70 hover:text-rouge"
              >
                @tantpis →
              </a>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {lifestyleImages.map((img, i) => (
                <div key={i} className="img-zoom">
                  {img}
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Mobile fixed ATC */}
      <MobileFixedAtc
        added={added}
        onClick={handleAdd}
        price={product.price}
        reduced={!!reduced}
      />
    </>
  );
}

/* -------------------------- ATC buttons -------------------------- */

function AtcButton({
  added,
  onClick,
  price,
}: {
  added: boolean;
  onClick: () => void;
  price: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className="group relative flex h-14 w-full items-center justify-center overflow-hidden border border-rouge bg-rouge text-cream transition-colors duration-300 hover:bg-cream hover:text-rouge"
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-mono inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.22em]"
          >
            <Check />
            Dans le panier · merci 👄
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-mono text-[0.78rem] uppercase tracking-[0.22em]"
          >
            Je le prends — {price}&nbsp;€
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function MobileFixedAtc({
  added,
  onClick,
  price,
  reduced,
}: {
  added: boolean;
  onClick: () => void;
  price: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -8px 24px -8px rgba(42,24,16,0.15)',
      }}
    >
      <div className="bg-cream/95 px-4 pb-3 pt-3 backdrop-blur-md">
        <AtcButton added={added} onClick={onClick} price={price} />
      </div>
    </motion.div>
  );
}

function Check() {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M5 12l5 5L20 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}
