import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
        {/* Massive type — the footer IS the closing statement */}
        <p className="font-display italic text-[18vw] leading-[0.85] tracking-[-0.03em] text-cream md:text-[12vw]">
          Tant Pis<span aria-hidden>.👄</span>
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 md:mt-16 md:grid-cols-4 md:gap-12">
          <nav aria-label="Pied de page">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-cream/45">
              Le shop
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/produit/la-grip-sock" className="hover:text-rouge transition-colors">
                  La chaussette
                </Link>
              </li>
              <li>
                <Link href="/panier" className="hover:text-rouge transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="La marque">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-cream/45">
              La marque
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-rouge transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@tantpis"
                  className="hover:text-rouge transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/tantpis"
                  className="hover:text-rouge transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-cream/45">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@tantpis.fr"
                  className="hover:text-rouge transition-colors"
                >
                  hello@tantpis.fr
                </a>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="hover:text-rouge transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-cream/45">
              D’où ça vient
            </p>
            <p className="mt-4 text-sm leading-[1.7] text-cream/70">
              Designé à Paris 11e.
              <br />
              Tricoté à Vila Nova de Famalicão, Portugal.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-cream/15 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Tant Pis. · Tous droits réservés</p>
          <p>v.1 · made with caffeine, not vibes</p>
        </div>
      </div>
    </footer>
  );
}
