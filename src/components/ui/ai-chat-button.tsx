'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/components/ThemeContext';

export function AIChatButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Hide button on chat page, show on other pages
  useEffect(() => {
    if (pathname === '/chat') {
      setIsVisible(false);
    } else {
      // Delay visibility for animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Don't render on chat page
  if (pathname === '/chat') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
      <motion.button
        onClick={() => router.push('/chat')}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Pulse animation ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Main button */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer transition-all">
          <motion.div
            animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.8 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 px-4 py-2 rounded-lg shadow-xl whitespace-nowrap text-sm font-semibold pointer-events-none"
            >
              Chat with AI Tutor
              <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-gray-900 dark:border-l-gray-700 border-b-8 border-b-transparent"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
