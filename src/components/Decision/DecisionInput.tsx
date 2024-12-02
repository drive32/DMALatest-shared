import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface DecisionInputProps {
  onDecision: (decision: any) => void;
}

export function DecisionInput({ onDecision }: DecisionInputProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    
    // Simulated API call
    setTimeout(() => {
      const decision = {
        recommendation: "Based on careful analysis of your situation, you should proceed with the decision. The potential benefits outweigh the risks, and there are clear opportunities for growth and development.",
        pros: [
          "Strong potential for professional growth",
          "Aligns with long-term career goals",
          "Offers competitive financial benefits",
          "Provides opportunity for skill development",
          "Includes mentorship opportunities"
        ],
        cons: [
          "Requires significant time investment",
          "Initial learning curve might be steep",
          "Some short-term uncertainty",
          "May require lifestyle adjustments",
          "Potential stress during transition"
        ],
        emotion: {
          type: "excited",
          description: "This decision shows excellent potential for positive outcomes and personal growth. The enthusiasm and optimism surrounding this choice suggest it's well-aligned with your aspirations."
        }
      };

      onDecision(decision);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label 
          htmlFor="decision-query" 
          className="block text-xl font-semibold text-sand-900 dark:text-sand-100"
        >
          What decision do you need help with?
        </label>
        <textarea
          id="decision-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-32 px-4 py-3 rounded-lg border border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 text-sand-900 dark:text-sand-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Describe your decision in detail..."
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Make Decision'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}