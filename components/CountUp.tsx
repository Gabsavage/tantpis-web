'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  useInView,
  useReducedMotion,
} from 'framer-motion';

type CountUpProps = {
  to: number;
  /** Pad to N digits (e.g. 2 → "01") */
  pad?: number;
  duration?: number;
  className?: string;
};

export default function CountUp({
  to,
  pad = 2,
  duration = 1.2,
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduced]);

  const display = Math.round(value).toString().padStart(pad, '0');

  return (
    <span ref={ref} className={className} aria-hidden>
      {display}
    </span>
  );
}
