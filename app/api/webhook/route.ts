import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// Webhook needs the raw body — disable Next.js automatic parsing.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET not configured' },
      { status: 500 }
    );
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[webhook] signature verification failed:', message);
    return NextResponse.json(
      { error: `Signature invalide: ${message}` },
      { status: 400 }
    );
  }

  // Pre-launch, just log the relevant events; persistence will land with
  // the order management iteration.
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[webhook] checkout.session.completed', {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        metadata: session.metadata,
      });
      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[webhook] checkout.session.expired', { id: session.id });
      break;
    }
    default:
      // Acknowledge other events without acting on them.
      break;
  }

  return NextResponse.json({ received: true });
}
