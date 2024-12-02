import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, BarChart } from 'lucide-react';
import { Recommendation } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  recommendation: Recommendation;
  onVote: (value: number) => void;
  onComment: (text: string) => void;
}

export function RecommendationCard({ recommendation, onVote, onComment }: Props) {
  const [comment, setComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onComment(comment);
    setComment('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-lg font-medium text-gray-900">{recommendation.text}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <BarChart className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-gray-500">
                {Math.round(recommendation.confidenceScore * 100)}% confidence
              </span>
            </div>
            {recommendation.matchScore && (
              <span className="text-sm text-gray-500">
                • {Math.round(recommendation.matchScore * 100)}% match with preferences
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-green-700">Pros</h4>
          <ul className="space-y-1">
            {recommendation.pros.map((pro, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-700">Cons</h4>
          <ul className="space-y-1">
            {recommendation.cons.map((con, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onVote(1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{recommendation.votes > 0 ? recommendation.votes : ''}</span>
            </button>
            <button
              onClick={() => onVote(-1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {recommendation.comments.length} comments
            </span>
          </div>
        </div>

        {recommendation.comments.length > 0 && (
          <div className="mt-4 space-y-3">
            {recommendation.comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Anonymous</span>
                  <span className="text-gray-500">
                    {formatDistanceToNow(comment.createdAt)} ago
                  </span>
                </div>
                <p className="mt-1 text-gray-600">{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}