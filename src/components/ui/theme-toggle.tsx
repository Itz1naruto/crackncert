'use client';

import { useTheme } from '../ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[ThemeToggle] Button clicked');
    console.log('[ThemeToggle] Current theme from context:', theme);
    
    // Force immediate DOM update
    const html = document.documentElement;
    const currentClasses = html.className;
    console.log('[ThemeToggle] HTML classes before toggle:', currentClasses);
    
    toggleTheme();
    
    // Double-check after toggle
    setTimeout(() => {
      console.log('[ThemeToggle] HTML classes after toggle:', document.documentElement.className);
      console.log('[ThemeToggle] Data-theme attribute:', document.documentElement.getAttribute('data-theme'));
    }, 100);
  };

  return (
    <motion.button
      onClick={handleToggle}
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-600"
      aria-label={`Toggle theme (current: ${theme})`}
      title={`Current: ${theme}. Click to switch.`}
      style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? (
            <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}