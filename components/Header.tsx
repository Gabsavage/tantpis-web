'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import Logo from './Logo';
import MobileDrawer from './MobileDrawer';

const DESKTOP_LINKS = [
  { href: '/produit/la-grip-sock', label: 'La collection' },
  { href: '/about', label: 'Notre histoire' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled && !drawerOpen;

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          transparent
            ? 'bg-transparent'
            : 'bg-cream/90 backdrop-blur-md border-b border-ink/10',
        ].join(' ')}
      >
        <div className="relative mx-auto flex h-16 max-w-[1600px] items-center px-5 md:h-20 md:px-10">
          {/* LEFT — hamburger (mobile) + nav (desktop) */}
          <div className="flex items-center gap-7">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={drawerOpen}
              className="relative inline-flex h-9 w-9 items-center justify-center md:hidden"
            >
              <Burger open={drawerOpen} />
            </button>

            {/* Desktop nav */}
            <nav
              aria-label="Navigation principale"
              className="hidden md:flex md:items-center md:gap-7"
            >
              {DESKTOP_LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      'text-sm transition-colors',
                      active
                        ? 'text-ink'
                        : 'text-ink/70 hover:text-ink',
                    ].join(' ')}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CENTER — logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo className="text-[1.35rem] md:text-[1.6rem] text-ink" />
          </div>

          {/* RIGHT — cart */}
          <div className="ml-auto flex items-center">
            <Link
              href="/panier"
              aria-label={`Panier (${hydrated ? count : 0} article${count > 1 ? 's' : ''})`}
              className="group relative inline-flex items-center gap-2 px-2 py-2 text-[0.78rem] uppercase tracking-[0.18em]"
            >
              <span className="hidden md:inline">Panier</span>
              <span
                aria-hidden
                className="relative inline-flex h-6 w-6 items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
                {hydrated && count > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rouge px-1 text-[0.6rem] font-normal not-italic text-cream">
                    {count}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function Burger({ open }: { open: boolean }) {
  // Two-line "hamburger" that morphs into × on open. Cleaner & more editorial
  // than a 3-line classic burger.
  return (
    <span aria-hidden className="relative block h-3 w-5">
      <motion.span
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 5 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 block h-px w-full bg-ink"
        style={{ transformOrigin: 'center' }}
      />
      <motion.span
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -5 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 block h-px w-full bg-ink"
        style={{ transformOrigin: 'center' }}
      />
    </span>
  );
}
