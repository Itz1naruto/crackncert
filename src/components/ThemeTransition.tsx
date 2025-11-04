'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { ReactNode, useEffect, useState } from 'react';

export function ThemeTransition({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [showWipe, setShowWipe] = useState(false);

  useEffect(() => {
    // Trigger wipe animation
    setShowWipe(true);
    
    // Reset after animation completes
    const timer = setTimeout(() => {
      setShowWipe(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [theme]);

  // Color of the overlay matches the NEW theme
  const overlayColor = theme === 'dark' ? '#111827' : '#ffffff';

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Wipe overlay - slides across from left to right */}
      <AnimatePresence>
        {showWipe && (
          <motion.div
            key={`wipe-${theme}`}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{ backgroundColor: overlayColor }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}