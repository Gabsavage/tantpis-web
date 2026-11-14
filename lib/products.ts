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
    price: 25,
    size: 'Unique (36-42)',
    shortDescription:
      'Picots silicone sous toute la semelle. Coton bio peigné. Trois couleurs qu’on porte vraiment.',
    longDescription:
      "Une chaussette qui reste en place, même sur Reformer. Picots silicone full sole (pas juste devant — partout). Coton bio peigné fil long pour qu’elles boulottent pas après trois lavages. Conçues à Paris 11e, tricotées à Vila Nova de Famalicão, au Portugal. 9 prototypes avant celle-là.",
    composition: '80% coton bio peigné, 15% polyamide, 5% élasthanne',
    grip: 'Picots silicone full sole — toute la semelle, pas juste sous les orteils',
    // Collection Lima — 3 coloris
    colorways: [
      { name: 'Cusco', hex: '#C2604A', image: '/images/product-cusco.jpg' },
      { name: 'Miraflores', hex: '#F2E8DC', image: '/images/product-miraflores.jpg' },
      { name: 'Barranco', hex: '#8A9E8C', image: '/images/product-barranco.jpg' },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
