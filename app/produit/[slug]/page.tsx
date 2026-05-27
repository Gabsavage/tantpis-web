import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, getProduct } from '@/lib/products';
import PlaceholderImage from '@/components/PlaceholderImage';
import ProductDetail from '@/components/sections/ProductDetail';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: 'Produit introuvable' };

  return {
    title: product.name,
    description:
      'Grip socks Pilates full sole, taille unique 36-42. Coloris Terracotta, Crème, Sauge. Livraison offerte dès 2 paires.',
    openGraph: {
      title: `${product.name} — Tant Pis.`,
      description: product.shortDescription,
      type: 'website',
      locale: 'fr_FR',
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  // Main gallery images keyed by colorway
  const galleryImages: Record<string, React.ReactNode> = {};
  for (const c of product.colorways) {
    galleryImages[c.hex] = (
      <PlaceholderImage
        src={c.image}
        alt={`${product.name} — coloris ${c.name}`}
        aspect="1/1"
        fallbackColor={c.hex}
        width={1080}
        height={1080}
        priority={c.hex === product.colorways[0].hex}
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    );
  }

  // Lifestyle thumbnails for the bottom section
  const lifestyleImages: React.ReactNode[] = [
    <PlaceholderImage
      key="lifestyle-1"
      src="/images/lifestyle-1.jpg"
      alt="Tant Pis. — lifestyle studio Pilates 1"
      aspect="1/1"
      fallbackColor="#8A9E8C"
      width={1080}
      height={1080}
      sizes="33vw"
      hideLabel
    />,
    <PlaceholderImage
      key="lifestyle-2"
      src="/images/lifestyle-2.jpg"
      alt="Tant Pis. — lifestyle studio Pilates 2"
      aspect="1/1"
      fallbackColor="#7A4F3A"
      width={1080}
      height={1080}
      sizes="33vw"
      hideLabel
    />,
    <PlaceholderImage
      key="lifestyle-3"
      src="/images/product-terra.jpg"
      alt="La Grip Sock — coloris Terracotta porté"
      aspect="1/1"
      fallbackColor="#C2604A"
      width={1080}
      height={1080}
      sizes="33vw"
      hideLabel
    />,
  ];

  return (
    <ProductDetail
      product={product}
      galleryImages={galleryImages}
      lifestyleImages={lifestyleImages}
    />
  );
}
