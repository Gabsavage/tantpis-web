import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette TANT PIS. — voir DESIGN_SYSTEM.md
        cream: '#F2E8DC', // crème — fond dominant
        terra: '#C2604A', // terracotta — accent unique
        ink: '#2A1810',   // brun foncé — texte & sections d'impact
        tabac: '#7A4F3A', // tabac — texte secondaire, labels
        sage: '#8A9E8C',  // sauge — touch, max 1 élément par page
        // Alias de compat — neutralise tout le fuchsia hérité vers la palette.
        rouge: '#C2604A', // ex-fuchsia → terracotta
        brown: '#7A4F3A', // ex-brun secondaire → tabac
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Alias hérités : une seule déco (Cormorant), labels/prix en Inter.
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      screens: {
        md: '768px',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
