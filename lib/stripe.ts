import 'server-only';
import Stripe from 'stripe';

// Lazy-init: instantiating with a placeholder key is safe (no network calls
// happen until an API method is called). API routes guard with an explicit
// process.env.STRIPE_SECRET_KEY check before using `stripe`, so the placeholder
// only ever flows through during build-time module evaluation without keys.
const key = process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder_build_only';

export const stripe = new Stripe(key, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const FREE_SHIPPING_THRESHOLD_EUROS = 44;
export const STANDARD_SHIPPING_EUROS = 4.9;

export function eurosToCents(amount: number): number {
  return Math.round(amount * 100);
}
