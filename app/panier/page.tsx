import type { Metadata } from 'next';
import CartPage from '@/components/sections/CartPage';

export const metadata: Metadata = {
  title: 'Panier',
  description: 'Ton panier Tant Pis. Livraison offerte dès 2 paires.',
  robots: { index: false, follow: true },
};

export default function PanierRoute({
  searchParams,
}: {
  searchParams: { expired?: string };
}) {
  return <CartPage expired={searchParams.expired === '1'} />;
}
