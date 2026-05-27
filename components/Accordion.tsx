'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type AccordionProps = {
  title: string;
  children: ReactNode;
  /** Open by default? */
  defaultOpen?: boolean;
};

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink/15">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[0.78rem] uppercase tracking-[0.24em] text-ink">
          {title}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-2xl leading-none text-ink/80"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3, ease: 'easeOut' },
            }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-8 text-[0.92rem] leading-[1.75] text-ink/75">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
