import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Angry, Meh, Zap } from 'lucide-react';

interface EmotionalImpactProps {
  emotion: {
    type: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited';
    description: string;
  };
}

const emotionConfig = {
  happy: {
    icon: Smile,
    gradient: 'from-yellow-400 to-amber-500',
    iconColor: 'text-yellow-400'
  },
  sad: {
    icon: Frown,
    gradient: 'from-blue-400 to-purple-500',
    iconColor: 'text-blue-400'
  },
  angry: {
    icon: Angry,
    gradient: 'from-red-400 to-orange-500',
    iconColor: 'text-red-400'
  },
  neutral: {
    icon: Meh,
    gradient: 'from-gray-400 to-gray-500',
    iconColor: 'text-gray-400'
  },
  excited: {
    icon: Zap,
    gradient: 'from-pink-400 to-purple-500',
    iconColor: 'text-pink-400'
  }
};

export function EmotionalImpact({ emotion }: EmotionalImpactProps) {
  const config = emotionConfig[emotion.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-sand-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-gradient-to-r ${config.gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100">
            Emotional Impact
          </h3>
          <p className="text-sand-700 dark:text-sand-300">
            {emotion.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}