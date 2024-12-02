import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200",
        isDark ? "bg-gray-800 text-accent-400" : "bg-gray-100 text-accent-600"
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
    </button>
  );
}