'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme immediately on mount
  useEffect(() => {
    const initTheme = () => {
      try {
        const savedTheme = localStorage.getItem('ncert-theme') as Theme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        console.log('[Theme] Initializing theme:', initialTheme);
        setTheme(initialTheme);
        applyTheme(initialTheme);
        setMounted(true);
      } catch (error) {
        console.error('[Theme] Error initializing theme:', error);
        setTheme('light');
        applyTheme('light');
        setMounted(true);
      }
    };

    initTheme();
  }, []);

  // Helper function to apply theme
  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
      html.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      html.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    
    console.log('[Theme] Applied theme:', newTheme, 'Classes:', html.className, 'Data-theme:', html.getAttribute('data-theme'));
  };

  // Update theme whenever it changes
  useEffect(() => {
    if (!mounted) return;
    
    console.log('[Theme] Theme changed to:', theme);
    localStorage.setItem('ncert-theme', theme);
    applyTheme(theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('[Theme] Toggle clicked, current theme:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('[Theme] Switching to:', newTheme);
    
    // Apply immediately
    applyTheme(newTheme);
    localStorage.setItem('ncert-theme', newTheme);
    
    // Update state
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}