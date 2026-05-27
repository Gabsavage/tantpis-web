export type Colorway = {
  name: string;
  hex: string;
  image: string;
};

export type Product = {
  name: string;
  slug: string;
  price: number;
  size: string;
  shortDescription: string;
  longDescription: string;
  composition: string;
  grip: string;
  colorways: Colorway[];
};

export const products: Product[] = [
  {
    name: 'La Grip Sock',
    slug: 'la-grip-sock',
    price: 22,
    size: 'Unique (36-42)',
    shortDescription:
      'La chaussette qui reste en place. Grip full sole, matières douces, coloris pensés pour le studio.',
    longDescription:
      "Conçue pour le Pilates Reformer et le tapis. Maintien renforcé à la cheville, picots silicone full sole pour une adhérence totale, fil peigné pour la douceur. Trois coloris terreux pour s'accorder au studio comme au quotidien.",
    composition: '80% coton, 15% polyamide, 5% élasthanne',
    grip: 'Picots silicone full sole',
    colorways: [
      { name: 'Terracotta', hex: '#C2604A', image: '/images/product-terra.jpg' },
      { name: 'Crème', hex: '#F2E8DC', image: '/images/product-creme.jpg' },
      { name: 'Sauge', hex: '#8A9E8C', image: '/images/product-sauge.jpg' },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
