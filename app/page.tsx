import { products } from '@/lib/products';
import PlaceholderImage from '@/components/PlaceholderImage';
import HomeHero from '@/components/sections/HomeHero';
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
      <HomeHero
        heroImage={
          /* IMG SLOT: /public/images/hero-flatlay.jpg — 1920×1080, flat lay terracotta */
          <PlaceholderImage
            src="/images/hero-flatlay.jpg"
            alt="Tant Pis. — flat lay des grip socks coloris terracotta"
            aspect="16/9"
            fallbackColor="#C2604A33"
            width={1920}
            height={1080}
            priority
            sizes="100vw"
          />
        }
      />

      <HomeProduct product={product} images={productImages} />

      <HomeStory
        aboutImage={
          /* IMG SLOT: /public/images/about-lima.jpg — 1440×960 */
          <PlaceholderImage
            src="/images/about-lima.jpg"
            alt="Atelier Tant Pis. — Paris / Lima"
            aspect="3/2"
            fallbackColor="#7A4F3A"
            width={1440}
            height={960}
            sizes="100vw"
          />
        }
      />

      <HomeReviews />

      <HomeFinalCTA />
    </>
  );
}
