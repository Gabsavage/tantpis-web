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
      'Picots silicone sous toute la semelle. Coton bio peigné. Trois couleurs qu’on porte vraiment.',
    longDescription:
      "Une chaussette qui reste en place, même sur Reformer. Picots silicone full sole (pas juste devant — partout). Coton bio peigné fil long pour qu’elles boulottent pas après trois lavages. Conçues à Paris 11e, tricotées à Vila Nova de Famalicão, au Portugal. 9 prototypes avant celle-là.",
    composition: '80% coton bio peigné, 15% polyamide, 5% élasthanne',
    grip: 'Picots silicone full sole — toute la semelle, pas juste sous les orteils',
    colorways: [
      { name: 'Terracotta', hex: '#C2604A', image: '/images/product-terra.jpg' },
      { name: 'Crème', hex: '#F4ECDC', image: '/images/product-creme.jpg' },
      { name: 'Sauge', hex: '#8A9E8C', image: '/images/product-sauge.jpg' },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
