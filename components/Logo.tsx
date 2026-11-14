import Link from 'next/link';

type LogoProps = {
  className?: string;
};

/**
 * Wordmark TANT PIS. Le bisou n'existe QUE dans le logo, en SVG, à la taille
 * d'un point typographique (DESIGN_SYSTEM.md — "Le bisou — Règle absolue").
 * Jamais d'emoji, jamais en grand, jamais ailleurs.
 */
export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Tant Pis. — Retour à l'accueil"
      className={`group font-display inline-flex items-baseline gap-[0.12em] text-[1.5rem] leading-none tracking-tight ${className}`}
    >
      <span className="relative inline-block">
        Tant Pis<Bisou />
      </span>
    </Link>
  );
}

/**
 * Le point se mue en lèvres au survol (morph par transition), puis un petit
 * cœur s'envole. Le bisou n'existe QUE dans le logo (DESIGN_SYSTEM).
 */
function Bisou() {
  return <BisouMark size="standard" />;
}

/**
 * Presets de dimensions + position du bisou. Source unique de vérité —
 * toucher ces valeurs propage partout (Logo header, Footer, Hero).
 *  — standard : pour le wordmark logo (header)
 *  — compact  : pour les titres plus gros (Hero, Footer)
 * La translation décale le bisou vers le bas du baseline pour que le bas du
 * point colle au bas du texte, et légèrement à gauche pour rapprocher du « s ».
 */
export const BISOU_PRESETS = {
  standard: 'h-[0.46em] w-[0.34em] -translate-x-[0.04em] translate-y-[0.18em]',
  compact: 'h-[0.4em] w-[0.28em] -translate-x-[0.035em] translate-y-[0.16em]',
} as const;

export type BisouSize = keyof typeof BISOU_PRESETS;

/**
 * Point typographique qui se mue en lèvres au survol (morph). Point et lèvres
 * partagent le même centre (même viewBox, origine center) → les lèvres
 * s'épanouissent depuis le point. Puis un petit cœur s'envole.
 * Réutilisé tel quel dans le hero / footer. Le bisou n'existe QUE dans le logo.
 */
export function BisouMark({
  size = 'standard',
  className = '',
}: {
  size?: BisouSize;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block align-baseline ${BISOU_PRESETS[size]} ${className}`}
    >
      {/* point au repos — grossit et s'efface au survol */}
      <span
        aria-hidden
        className="absolute inset-0 origin-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.7] group-hover:opacity-0 motion-reduce:transition-none"
      >
        <svg viewBox="0 0 36 32" className="block h-full w-full" fill="#C2604A">
          <circle cx="18" cy="17" r="5.5" />
        </svg>
      </span>
      {/* lèvres — s'épanouissent depuis le centre (= le point) */}
      <span
        aria-hidden
        className="absolute inset-0 origin-center rotate-[14deg] scale-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 motion-reduce:transition-none"
      >
        <svg viewBox="0 0 36 32" className="block h-full w-full" fill="#C2604A">
          {/* lèvre supérieure — léger arc de Cupidon, un peu plus épaisse */}
          <path d="M4 14 C8 6 14 6 18 11 C22 6 28 6 32 14 C27.5 12 22 13 18 13.8 C14 13 8.5 12 4 14 Z" />
          {/* lèvre inférieure — pleine */}
          <path d="M5 15 C13 16.4 23 16.4 31 15 C26 27 10 27 5 15 Z" />
        </svg>
      </span>
      {/* le bisou qui s'envole — un petit cœur lancé */}
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        className="bisou-kiss pointer-events-none absolute inset-0 block h-full w-full opacity-0"
        fill="#C2604A"
      >
        <path d="M16 24 C16 24 8 19 8 13.5 C8 10.5 10.3 9 12.5 9 C14 9 15.4 10 16 11.2 C16.6 10 18 9 19.5 9 C21.7 9 24 10.5 24 13.5 C24 19 16 24 16 24 Z" />
      </svg>
    </span>
  );
}
