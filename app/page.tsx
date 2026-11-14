import { products } from '@/lib/products';
import PlaceholderImage from '@/components/PlaceholderImage';
import HomeHero from '@/components/sections/HomeHero';
import HomeFounderNote from '@/components/sections/HomeFounderNote';
import HomeProduct from '@/components/sections/HomeProduct';
import HomeStory from '@/components/sections/HomeStory';
import HomeReviews from '@/components/sections/HomeReviews';
import HomeFinalCTA from '@/components/sections/HomeFinalCTA';

/**
 * The homepage is an editorial scroll : Hero → Produit → Storytelling →
 * Social proof → CTA. Sections are client components for Framer animations,
 * but image slots are server-rendered so the file-existence check for
 * placeholders happens at build time.
 */
export default async function HomePage() {
  const product = products[0];

  // Pre-render the per-colorway product images on the server so the client
  // section just picks the right one based on the selected swatch.
  const productImages: Record<string, React.ReactNode> = {};
  for (const c of product.colorways) {
    productImages[c.hex] = (
      <PlaceholderImage
        src={c.image}
        alt={`${product.name} — coloris ${c.name}`}
        aspect="3/4"
        fallbackColor={c.hex}
        width={1080}
        height={1440}
        sizes="(min-width: 768px) 60vw, 100vw"
      />
    );
  }

  return (
    <>
      <HomeHero />

      <HomeFounderNote />

      <HomeProduct product={product} images={productImages} />

      <HomeStory />

      <HomeReviews />

      <HomeFinalCTA />
    </>
  );
}
