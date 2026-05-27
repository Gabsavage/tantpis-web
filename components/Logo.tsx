import Link from 'next/link';

type LogoProps = {
  className?: string;
};

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Tant Pis. — Retour à l'accueil"
      className={`font-display inline-flex items-baseline gap-[0.05em] text-[1.5rem] leading-none tracking-tight ${className}`}
    >
      <span>Tant Pis</span>
      <span aria-hidden className="not-italic text-[0.7em] translate-y-[-0.05em]">
        👄
      </span>
    </Link>
  );
}
