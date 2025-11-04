'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationType = 'bounce' | 'slideIn' | 'slideOut' | 'blurSlideIn' | 'blurSlideOut' | 'none';

interface AnimatedButtonProps {
  children: ReactNode;
  animation?: AnimationType;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const animationVariants = {
  bounce: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    whileHover: { x: 5, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  slideOut: {
    initial: { x: 0, opacity: 1 },
    whileHover: { x: -5, opacity: 0.8 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  blurSlideIn: {
    initial: { x: -20, opacity: 0, filter: 'blur(10px)' },
    animate: { x: 0, opacity: 1, filter: 'blur(0px)' },
    whileHover: { scale: 1.02, filter: 'blur(0px)' },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  blurSlideOut: {
    initial: { x: 0, opacity: 1, filter: 'blur(0px)' },
    whileHover: { x: -5, opacity: 0.8, filter: 'blur(5px)' },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  none: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

export function AnimatedButton({
  children,
  animation = 'bounce',
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: AnimatedButtonProps) {
  const variants = animationVariants[animation];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      initial={variants.initial}
      animate={variants.animate}
      whileHover={variants.whileHover}
      whileTap={variants.whileTap}
      transition={variants.transition}
      className={className}
    >
      {children}
    </motion.button>
  );
}
