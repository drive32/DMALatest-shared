import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Brain } from 'lucide-react';

interface DecisionInputProps {
  onSubmit: (question: string) => void;
}

export function DecisionInput({ onSubmit }: DecisionInputProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    
    setTimeout(() => {
      onSubmit(question);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent-50 rounded-lg">
          <Brain className="w-6 h-6 text-accent-600" />
        </div>
        <h2 className="text-xl font-display font-bold text-primary">
          Make a Decision
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="decision-question" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What decision do you need help with?
          </label>
          <textarea
            id="decision-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="input-primary w-full h-32 resize-none"
            placeholder="Describe your decision in detail..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="btn-primary inline-flex items-center justify-center px-6 py-3 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Get AI Recommendation
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}