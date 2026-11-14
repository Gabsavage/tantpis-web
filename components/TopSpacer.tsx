'use client';

import { usePathname } from 'next/navigation';
import { MARQUEE_HEIGHT } from './MarqueeTop';

/**
 * Le marquee est en position fixe (hors flux). Hors home, on réserve sa hauteur
 * en haut du contenu pour qu'il ne passe pas dessous. Sur la home, le hero est
 * plein écran : pas de spacer.
 */
export default function TopSpacer() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return <div aria-hidden style={{ height: MARQUEE_HEIGHT }} />;
}
