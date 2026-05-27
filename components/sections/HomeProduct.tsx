'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import type { Product } from '@/lib/products';

type ProductImageMap = Record<string, ReactNode>;

type HomeProductProps = {
  product: Product;
  /** Map of colorway-hex → server-rendered <PlaceholderImage /> */
  images: ProductImageMap;
};

export default function HomeProduct({ product, images }: HomeProductProps) {
  const reduced = useReducedMotion();
  const [selectedHex, setSelectedHex] = useState(product.colorways[0].hex);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const selected =
    product.colorways.find((c) => c.hex === selectedHex) ?? product.colorways[0];

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
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section
      aria-labelledby="product-heading"
      className="bg-cream px-5 py-24 md:px-10 md:py-36"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ink/55">
            01 — La chaussette
          </p>
          <h2
            id="product-heading"
            className="font-display italic mt-4 text-5xl leading-[0.95] tracking-tight text-ink md:text-7xl"
          >
            {product.name}
          </h2>
          <p className="mt-6 max-w-md text-[0.98rem] leading-[1.7] text-ink/80">
            {product.shortDescription}
          </p>

          {/* Colorway swatches */}
          <fieldset className="mt-10">
            <legend className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ink/55">
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

          {/* Price + CTA */}
          <div className="mt-10 flex items-baseline gap-6">
            <p className="font-display italic text-4xl text-ink">
              <span className="font-mono not-italic">{product.price}</span>&nbsp;€
            </p>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink/55">
              36 – 42
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleAdd}
              className="group relative inline-flex items-center justify-center gap-3 border border-rouge bg-rouge px-8 py-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-cream hover:text-rouge"
            >
              <span>{added ? 'Ajouté · merci 👄' : 'Je le prends'}</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </button>
            <Link
              href={`/produit/${product.slug}`}
              className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-ink/65 underline-offset-4 hover:text-ink hover:underline"
            >
              Tout savoir
            </Link>
          </div>

          <p className="mt-5 max-w-xs text-xs leading-[1.6] text-ink/60">
            Taille unique 36–42 (oui, c’est large — on a un peu galéré aussi sur les premiers protos). Livraison offerte à partir de 2 paires.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
