'use client';

import { create } from 'zustand';

/**
 * Transient UI state (non persisté) : pilote l'ouverture du drawer panier
 * depuis n'importe où (header, boutons d'ajout, etc.).
 */
type UIState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  /** Le ticker (barre fixe en haut) est-il visible ? Pilote l'offset du header. */
  marqueeShown: boolean;
  setMarqueeShown: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  marqueeShown: false,
  setMarqueeShown: (v) =>
    set((s) => (s.marqueeShown === v ? s : { marqueeShown: v })),
}));
