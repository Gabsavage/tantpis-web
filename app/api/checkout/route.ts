import { NextResponse } from 'next/server';
import { stripe, eurosToCents } from '@/lib/stripe';
import type { CartItem } from '@/lib/cart-store';
import { getProduct } from '@/lib/products';

type CheckoutBody = {
  items: CartItem[];
};

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Paiement indisponible — clé Stripe non configurée.' },
      { status: 500 }
    );
  }

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 });
  }

  // Re-validate each line against our product catalogue. Never trust prices
  // sent from the client — always look them up server-side.
  const lineItems = body.items.map((item) => {
    const product = getProduct(item.slug);
    if (!product) {
      throw new Response(`Unknown product: ${item.slug}`, { status: 400 });
    }
    const colorway = product.colorways.find((c) => c.name === item.colorway);
    if (!colorway) {
      throw new Response(
        `Unknown colorway for ${item.slug}: ${item.colorway}`,
        { status: 400 }
      );
    }

    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${product.name} — ${colorway.name}`,
          metadata: { slug: product.slug, colorway: colorway.name },
        },
        unit_amount: eurosToCents(product.price),
      },
      quantity: Math.max(1, Math.min(99, Math.floor(item.quantity))),
    };
  });

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get('origin') ??
    'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      locale: 'fr',
      success_url: `${origin}/commande/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
      shipping_address_collection: { allowed_countries: ['FR'] },
      // NOTE: as specified, single free-shipping option for launch.
      // Free-shipping-threshold UX in the cart is informational; revisit if
      // we want to charge the 4,90€ for single-pair orders.
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Livraison standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      metadata: { source: 'tantpis-web' },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe a renvoyé une session sans URL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error('[checkout] Stripe error:', err);
    return NextResponse.json(
      { error: 'Le paiement n\'a pas pu être lancé, réessaie.' },
      { status: 500 }
    );
  }
}
