import React from 'react';
import { motion } from 'framer-motion';
import { PenSquare, MessageCircle, ThumbsUp } from 'lucide-react';

const steps = [
  {
    icon: PenSquare,
    title: 'Post Your Decision',
    description: 'Share the decision you need help with and provide context.'
  },
  {
    icon: MessageCircle,
    title: 'Get Feedback',
    description: 'Receive insights and perspectives from community members.'
  },
  {
    icon: ThumbsUp,
    title: 'Vote & Comment',
    description: 'Engage with others and help them make better decisions.'
  }
];

export function HowItWorks() {
  return (
    <div className='max-w-7xl mx-auto'>
    <section className="mb-12">
      <h2 className="text-2xl font-display font-bold text-primary mb-8 text-center">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-secondary rounded-xl p-6 text-center border border-gray-100"
          >
            <div className=" w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center transform rotate-1 hover:rotate-6 transition-transform rounded-full flex items-center justify-center mx-auto mb-4">
              <step.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-primary mb-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {step.title}
            </h3>
            <p className="text-gray-600">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
    </div>
  );
}