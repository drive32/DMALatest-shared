import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, BarChart2, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations based on your specific decision criteria.'
  },
  {
    icon: Users,
    title: 'Collaborative Decision Making',
    description: 'Involve your team and stakeholders in the decision-making process.'
  },
  {
    icon: BarChart2,
    title: 'Advanced Analytics',
    description: 'Visualize and analyze decision factors with powerful analytics tools.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay informed with real-time updates and notifications on decision progress.'
  }
];

export function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-secondary hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className='w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center transform rotate-1 hover:rotate-6 transition-transform mb-3'>
                <feature.icon className="w-8 h-8 text-white" strokeWidth={1.5}/>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}