import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Brain } from 'lucide-react';

interface DecisionOutputProps {
  decision: {
    question: string;
    recommendation: string;
    pros: string[];
    cons: string[];
    votes: {
      up: number;
      down: number;
    };
  };
}

export function DecisionOutput({ decision }: DecisionOutputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Recommendation Section */}
      <div className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-sand-900 dark:text-sand-100">
            AI Recommendation
          </h2>
        </div>
        
        <p className="text-sand-700 dark:text-sand-300 text-lg">
          {decision.recommendation}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span>{decision.votes.up}</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            <ThumbsDown className="w-4 h-4" />
            <span>{decision.votes.down}</span>
          </button>
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100">
              Pros
            </h3>
          </div>
          <ul className="space-y-2">
            {decision.pros.map((pro, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sand-700 dark:text-sand-300"
              >
                <span className="text-green-500 mt-1">•</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100">
              Cons
            </h3>
          </div>
          <ul className="space-y-2">
            {decision.cons.map((con, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sand-700 dark:text-sand-300"
              >
                <span className="text-red-500 mt-1">•</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}