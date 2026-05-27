'use client';

import { useEffect, useState } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';

type AnimatedPriceProps = {
  /** Euros, e.g. 44 or 22.5 */
  value: number;
  /** Number of decimal places to display. */
  decimals?: number;
  /** When false, "0" is shown as "0" instead of "0,00" */
  alwaysShowDecimals?: boolean;
  className?: string;
};

function formatEuros(v: number, decimals: number, alwaysShow: boolean) {
  const hasDecimals = alwaysShow || Math.round(v * 100) % 100 !== 0;
  const opts: Intl.NumberFormatOptions = hasDecimals
    ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
    : { minimumFractionDigits: 0, maximumFractionDigits: 0 };
  return new Intl.NumberFormat('fr-FR', opts).format(v);
}

export default function AnimatedPrice({
  value,
  decimals = 2,
  alwaysShowDecimals = false,
  className = '',
}: AnimatedPriceProps) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, mv, reduced]);

  return (
    <span className={className}>
      {formatEuros(display, decimals, alwaysShowDecimals)}&nbsp;€
    </span>
  );
}
