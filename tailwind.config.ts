import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — Rouge Baiser
        cream: '#F4ECDC', // un poil plus chaud que l'ancien
        rouge: '#D63C5E', // accent unique — lipstick / 👄
        ink: '#1A1612',   // presque noir mais pas tout à fait
        // Carrying over for product variant naming only (physical sock colors)
        terra: '#C2604A',
        brown: '#3A2A1E', // muted ink-ish neutral — used for secondary text
        sage: '#8A9E8C',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        // Legacy aliases retained so existing className references still resolve.
        // serif used in a couple of places — alias to display.
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
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
