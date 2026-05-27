'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'
      );
      setHovering(!!interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [visible, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        translateX: springX,
        translateY: springY,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[100]"
    >
      <motion.span
        animate={{
          scale: hovering ? 2.6 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rouge ring-1 ring-cream/80"
      />
    </motion.div>
  );
}
