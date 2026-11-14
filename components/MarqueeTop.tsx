'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUI } from '@/lib/ui-store';

/**
 * Ticker — barre défilante fixe en haut de page (DESIGN_SYSTEM.md § Éléments
 * signature). Fond terracotta, texte crème, Inter 500 uppercase 10px.
 *
 * Sur la home : masquée pendant le hero plein écran, elle apparaît au scroll
 * puis disparaît dès qu'on atteint la section produit (#produit). Ailleurs :
 * toujours visible. Sa visibilité pilote l'offset du header (via le store).
 */
export const MARQUEE_HEIGHT = 32;

const ITEMS = [
  'Livraison offerte dès 2 paires',
  'Pour le reformer, le tapis, et le café d’après',
  '25 € la paire',
  'Retours 30 jours',
];

export default function MarqueeTop() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [shown, setShown] = useState(!isHome);
  const setMarqueeShown = useUI((s) => s.setMarqueeShown);
  const last = useRef<boolean | null>(null);
  const passed = useRef(false);

  useEffect(() => {
    const apply = (v: boolean) => {
      if (last.current === v) return;
      last.current = v;
      setShown(v);
      setMarqueeShown(v);
    };

    if (!isHome) {
      apply(true);
      return;
    }

    const onScroll = () => {
      // Apparaît dès qu'on commence à scroller, reste pendant la section
      // produit, puis se verrouille caché une fois le produit dépassé (ne
      // réapparaît plus en bas de page). Se redéverrouille si on remonte
      // au-dessus du produit.
      const started = window.scrollY > 30;
      const product = document.getElementById('produit');
      if (product) {
        const r = product.getBoundingClientRect();
        if (r.bottom <= MARQUEE_HEIGHT + 4) passed.current = true;
        else if (r.top > MARQUEE_HEIGHT) passed.current = false;
      }
      apply(started && !passed.current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, setMarqueeShown]);

  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden
      style={{ height: MARQUEE_HEIGHT }}
      className={[
        'fixed inset-x-0 top-0 z-40 flex items-center overflow-hidden bg-terra text-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        shown ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
    >
      <div className="animate-marquee marquee-track">
        {track.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center font-sans text-[10px] font-medium uppercase tracking-[0.14em]"
          >
            <span className="px-5">{label}</span>
            <span aria-hidden className="text-cream/45">
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
