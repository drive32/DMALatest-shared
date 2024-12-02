import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function FloatingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        to="/signup"
        className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <span className="font-medium">Try Now</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  );
}