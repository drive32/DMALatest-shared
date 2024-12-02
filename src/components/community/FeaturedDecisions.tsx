import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { DecisionCard } from './DecisionCard';

interface Decision {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  tags: Array<{ id: string; name: string }>;
  image?: string;
  votes: {
    up: number;
    down: number;
  };
  comments: Array<{
    id: string;
    text: string;
    author: string;
    createdAt: Date;
  }>;
}

interface Props {
  decisions: Decision[];
}

export function FeaturedDecisions({ decisions }: Props) {
  if (decisions.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-accent-600" />
        <h2 className="text-2xl font-display font-bold text-primary">
          Featured Decisions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decisions.map((decision) => (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="transform hover:scale-[1.02] transition-transform"
          >
            <DecisionCard
              decision={decision}
              onVote={() => {}}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}