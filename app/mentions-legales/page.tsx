import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Tant Pis.',
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    title: 'Éditeur du site',
    body: (
      <>
        [Nom / Raison sociale] — [Adresse] — [Email contact]
        <br />
        <span className="text-brown/60">
          {/* TODO : compléter avec les infos légales réelles */}
          {/* TODO : compléter avec les infos légales réelles */}
        </span>
      </>
    ),
  },
  {
    title: 'Hébergement',
    body: (
      <>
        Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina,
        CA 91723, USA.
        <br />
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline hover:text-terra"
        >
          vercel.com
        </a>
      </>
    ),
  },
  {
    title: 'Propriété intellectuelle',
    body: (
      <>
        L&apos;ensemble des contenus présents sur ce site (textes, images,
        logo, identité visuelle) sont la propriété exclusive de Tant Pis. Toute
        reproduction sans autorisation est interdite.
      </>
    ),
  },
  {
    title: 'Données personnelles',
    body: (
      <>
        Les données collectées lors d&apos;une commande (nom, adresse, email)
        sont utilisées uniquement pour le traitement de votre commande. Elles
        ne sont pas revendues à des tiers.
        <br />
        <br />
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification et de suppression de vos données. Contact&nbsp;:{' '}
        <a
          href="mailto:hello@tantpis.fr"
          className="underline-offset-4 hover:underline hover:text-terra"
        >
          hello@tantpis.fr
        </a>
        .
      </>
    ),
  },
  {
    title: 'Cookies',
    body: (
      <>
        Ce site utilise uniquement les cookies strictement nécessaires à son
        fonctionnement (panier, session de paiement Stripe). Aucun cookie
        publicitaire ou de tracking.
      </>
    ),
  },
  {
    title: 'Litiges',
    body: (
      <>
        En cas de litige, une solution amiable sera recherchée avant toute
        action judiciaire. Le droit français est applicable.
      </>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="bg-cream pt-28 md:pt-36">
      <article className="mx-auto max-w-[720px] px-6 pb-24 md:pb-32">
        <h1 className="font-display italic text-5xl leading-[1.02] tracking-tight text-dark md:text-6xl">
          Mentions légales
        </h1>
        <p className="mt-4 text-sm font-light text-brown/70">
          Dernière mise à jour&nbsp;: mai 2026
        </p>

        <div className="mt-12 space-y-12 md:mt-16">
          {SECTIONS.map((s, i) => (
            <section key={s.title}>
              <h2 className="text-[0.78rem] uppercase tracking-[0.22em] text-dark">
                {String(i + 1).padStart(2, '0')} — {s.title}
              </h2>
              <div className="mt-4 text-[0.95rem] font-light leading-[1.8] text-dark/80">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 border-t border-dark/15 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.22em] text-brown transition-colors hover:text-dark"
          >
            <span aria-hidden>←</span> Retour à l&apos;accueil
          </Link>
        </div>
      </article>
    </div>
  );
}
