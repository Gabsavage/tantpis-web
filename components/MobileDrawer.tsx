'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const LINKS = [
  { href: '/', label: 'Boutique' },
  { href: '/produit/la-grip-sock', label: 'La collection' },
  { href: '/about', label: 'Notre histoire' },
  { href: '/panier', label: 'Panier' },
];

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  // Lock body scroll while open + close on Escape
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

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
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-dark/30 md:hidden"
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-[70] flex w-[84%] max-w-sm flex-col bg-cream px-6 pb-10 pt-6 md:hidden"
          >
            <div className="flex h-12 items-center">
              {/* close handled by header button — leave space for symmetry */}
              <span aria-hidden className="h-8 w-8" />
            </div>

            <nav aria-label="Menu principal" className="mt-8">
              <ul className="space-y-6">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.1 + i * 0.06,
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="font-display italic block text-3xl text-dark transition-colors hover:text-terra"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto pt-10">
              <p className="font-display italic text-lg text-dark">
                Tant Pis<span aria-hidden>👄</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-brown/70">
                Grip socks pour le Pilates. Fait à Paris.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
