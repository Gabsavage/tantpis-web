import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-cream">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-5">
            <p className="font-display italic text-3xl md:text-5xl leading-[0.95] text-cream">
              Tant Pis<span aria-hidden>👄</span>
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">
              Grip socks pour le Pilates. Pensées pour le studio,
              dessinées pour le quotidien.
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Pied de page"
            className="md:col-span-3 md:col-start-7"
          >
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-cream/50">
              Navigation
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-terra transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  href="/produit/la-grip-sock"
                  className="hover:text-terra transition-colors"
                >
                  La Grip Sock
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-terra transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/panier"
                  className="hover:text-terra transition-colors"
                >
                  Panier
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <div className="md:col-span-3">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-cream/50">
              Informations
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="hover:text-terra transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@tantpis.fr"
                  className="hover:text-terra transition-colors"
                >
                  hello@tantpis.fr
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@tantpis"
                  className="hover:text-terra transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Tant Pis. Tous droits réservés.</p>
          <p className="font-display italic text-sm text-cream/60">
            Fait avec soin à Paris.
          </p>
        </div>
      </div>
    </footer>
  );
}
