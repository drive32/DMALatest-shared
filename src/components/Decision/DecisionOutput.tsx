import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface DecisionOutputProps {
  decision: {
    recommendation: string;
    pros: string[];
    cons: string[];
  };
}

export function DecisionOutput({ decision }: DecisionOutputProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-sand-900 dark:text-sand-100 mb-4">
          AI Recommendation
        </h2>
        <p className="text-sand-700 dark:text-sand-300 text-lg">
          {decision.recommendation}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
        >
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
        </motion.div>
      </div>
    </div>
  );
}