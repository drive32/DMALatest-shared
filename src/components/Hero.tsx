import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-accent-600/5 to-accent-700/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Make Better Decisions
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                with Community Insights
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              Join our community to share decisions, get feedback, and make better choices together. 
              Plus, get AI-powered insights when you need them.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate('/signin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center justify-center px-8 py-3 text-lg shadow-lg hover:shadow-xl"
              >
                Join Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>

             
            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 lg:justify-self-end"
          >
            <motion.div
              className="relative max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent-100/30 to-accent-200/30 rounded-3xl transform -rotate-2" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-100/30 to-accent-200/30 rounded-3xl transform rotate-2" />
              
              <img
                src="/decisionimg.jpg"
                alt="Community decision making illustration"
                className="relative z-10 w-full h-auto max-w-md mx-auto rounded-3xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent-50/10 to-transparent rounded-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}