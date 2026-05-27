import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#2A1810',
        brown: '#7A4F3A',
        cream: '#F2E8DC',
        terra: '#C2604A',
        sage: '#8A9E8C',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      screens: {
        md: '768px',
      },
    },
  },
  plugins: [],
};

export default config;
