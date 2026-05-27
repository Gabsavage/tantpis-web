import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import OrderClearCart from '@/components/OrderClearCart';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Commande confirmée',
  robots: { index: false, follow: false },
};

function formatEuros(cents: number | null | undefined, currency = 'eur') {
  if (cents == null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export default async function OrderConfirmation({
  params,
}: {
  params: { id: string };
}) {
  if (!process.env.STRIPE_SECRET_KEY) {
    redirect('/');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(params.id, {
      expand: ['line_items'],
    });
  } catch (err) {
    console.error('[order] retrieve failed:', err);
    redirect('/');
  }

  if (session.status === 'expired') {
    redirect('/panier?expired=1');
  }
  if (session.status !== 'complete') {
    redirect('/panier');
  }

  const email = session.customer_details?.email ?? '—';
  const total = formatEuros(session.amount_total, session.currency ?? 'eur');
  const itemCount =
    session.line_items?.data.reduce((n, l) => n + (l.quantity ?? 0), 0) ?? 0;

  return (
    <div className="bg-cream pt-28 md:pt-36">
      {/* Persistent cart is cleared client-side once confirmation renders */}
      <OrderClearCart />

      <div className="mx-auto flex max-w-[720px] flex-col items-center px-6 pb-28 text-center md:pb-40">
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-brown">
          — Confirmation
        </p>
        <h1 className="font-display italic mt-6 text-5xl leading-[0.98] tracking-tight text-dark md:text-7xl">
          Commande confirmée<span aria-hidden> 🎉</span>
        </h1>

        <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-dark/80 md:text-lg">
          Tant pis d&apos;avoir attendu aussi longtemps.
        </p>

        <dl className="mt-12 grid w-full max-w-md grid-cols-1 gap-3 border-t border-dark/15 pt-8 text-left text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-brown/80">Confirmation envoyée à</dt>
            <dd className="text-dark">{email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-brown/80">Articles</dt>
            <dd className="text-dark">{itemCount}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-dark/15 pt-3">
            <dt className="text-brown/80">Total</dt>
            <dd className="font-display italic text-lg text-dark">{total}</dd>
          </div>
        </dl>

        <p className="mt-10 max-w-md text-xs leading-relaxed text-brown">
          Tu reçois ton e-mail de confirmation dans quelques instants. Livraison
          sous 3 à 5 jours ouvrés.
        </p>

        <Link
          href="/"
          className="group mt-12 inline-flex items-center gap-3 border border-dark bg-dark px-7 py-4 text-[0.78rem] uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-cream hover:text-dark"
        >
          <span>Retour à l&apos;accueil</span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
