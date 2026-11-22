import React from 'react';
import { motion } from 'motion/react';

export const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function EditorialReveal({
  children,
  className = '',
  delay = 0,
  y = 20,
}: EditorialRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HairlineRuleProps {
  className?: string;
  delay?: number;
}

export function HairlineRule({ className = '', delay = 0 }: HairlineRuleProps) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.85, delay, ease: EDITORIAL_EASE }}
      style={{ transformOrigin: 'left center' }}
      className={`h-px bg-[#252521]/15 ${className}`}
    />
  );
}
