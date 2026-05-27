'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart-store';

/**
 * Renders nothing — clears the persisted Zustand cart once on mount.
 * Used by the order confirmation page so the user lands on a fresh cart
 * if they navigate back.
 */
export default function OrderClearCart() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
