import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/decision/Sidebar';
import { DecisionInput } from '../components/decision/DecisionInput';
import { DecisionOutput } from '../components/decision/DecisionOutput';
import { EmotionalImpact } from '../components/decision/EmotionalImpact';
import { Comments } from '../components/decision/Comments';
import { ShareSection } from '../components/decision/ShareSection';

interface Decision {
  id: string;
  question: string;
  recommendation: string;
  pros: string[];
  cons: string[];
  emotion: {
    type: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited';
    description: string;
  };
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

export function DecisionPage() {
  const [decision, setDecision] = useState<Decision | null>(null);

  const handleDecisionSubmit = (question: string) => {
    // Simulate API call with mock data
    const mockDecision: Decision = {
      id: crypto.randomUUID(),
      question,
      recommendation: "Based on careful analysis, you should proceed with the decision. The potential benefits outweigh the risks.",
      pros: [
        "Strong growth potential",
        "Aligns with goals",
        "Financial benefits",
        "Skill development",
        "Networking opportunities"
      ],
      cons: [
        "Initial time investment",
        "Learning curve",
        "Short-term uncertainty",
        "Resource allocation",
        "Potential stress"
      ],
      emotion: {
        type: "excited",
        description: "This decision shows excellent potential for positive outcomes and personal growth."
      },
      votes: {
        up: 0,
        down: 0
      },
      comments: []
    };

    setDecision(mockDecision);
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <DecisionInput onSubmit={handleDecisionSubmit} />
          
          <AnimatePresence mode="wait">
            {decision && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <DecisionOutput decision={decision} />
                <EmotionalImpact emotion={decision.emotion} />
                <ShareSection decisionId={decision.id} />
                <Comments 
                  comments={decision.comments}
                  onAddComment={(text) => {
                    setDecision(prev => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        comments: [
                          ...prev.comments,
                          {
                            id: crypto.randomUUID(),
                            text,
                            author: 'You',
                            createdAt: new Date()
                          }
                        ]
                      };
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}