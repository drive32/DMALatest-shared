import React from 'react';
import { Brain, Users } from 'lucide-react';
import { Decision } from '../../types';
import { RecommendationCard } from './RecommendationCard';
import { useStore } from '../../store';

interface Props {
  decision: Decision;
}

export function AnalysisView({ decision }: Props) {
  const { voteRecommendation, addComment } = useStore();

  const handleVote = (recommendationId: string, value: number) => {
    voteRecommendation(decision.id, recommendationId, value);
  };

  const handleComment = (recommendationId: string, text: string) => {
    addComment(decision.id, recommendationId, text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{decision.title}</h2>
            <p className="mt-1 text-gray-600">{decision.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{decision.collaborators.length} collaborators</span>
          </div>
        </div>

        {decision.deadline && (
          <div className="mt-4 text-sm text-gray-500">
            Deadline: {decision.deadline.toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
        </div>

        <div className="space-y-4">
          {decision.aiRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onVote={(value) => handleVote(recommendation.id, value)}
              onComment={(text) => handleComment(recommendation.id, text)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}