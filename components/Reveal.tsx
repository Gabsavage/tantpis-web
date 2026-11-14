'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type RevealProps = {
  children: ReactNode;
  /** Délai avant l'apparition (s). */
  delay?: number;
  /** "up" (défaut) = monte en fondu. "mask" = révélé par un volet vertical. */
  variant?: 'up' | 'mask';
  className?: string;
  as?: 'div' | 'span' | 'li' | 'p';
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Révélation au scroll, réutilisable et cohérente avec le ton éditorial :
 * mouvement lent, ease soyeux, déclenché une seule fois à l'entrée en vue.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  if (variant === 'mask') {
    return (
      <span className={`inline-block overflow-hidden ${className}`}>
        <MotionTag
          initial={{ y: '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE, delay }}
          className="inline-block"
        >
          {children}
        </MotionTag>
      </span>
    );
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
