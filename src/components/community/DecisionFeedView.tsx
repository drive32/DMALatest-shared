import React, { useState, useEffect } from 'react';
import {  Clock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDecisions } from '../../hooks/useDecisions';
import { toast } from 'sonner';
import { formatDate } from '../../utils/dateUtils'
import { VoteButton } from './VoteButton';
import { DecisionAnalytics } from './DecisionAnalytics';


interface Decision {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  category: string | null;
  image_url: string | null;
  votes?: { up: number; down: number };
  comments?: Array<any>;
  decision_expired?: string | null;
  profiles?: { fullname?: string; email?: string; avatar: string };
}

interface Props {
  decision: Decision;
  onVote: (decisionId: string, voteType: 'up' | 'down') => void;
  onEdit: (decision: Decision) => void;
}



export function DecisionFeedView({ decision, onVote, onEdit }: Props) {
  const { user } = useAuth();
  const { deleteDecision } = useDecisions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);


  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this decision?')) {
      setIsDeleting(true);
      try {
        await deleteDecision(decision.id);
        toast.success('Decision deleted successfully');
      } catch (error) {
        console.error('Error deleting decision:', error);
        toast.error('Failed to delete decision');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      await onVote(decision.id, voteType);
    } finally {
      setIsVoting(false);
    }
  };


  return (
    <>
      {decision.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={decision.image_url}
            alt=""
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="w-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.12)] p-8 hover:shadow-[0_0_50px_-6px_rgb(0,0,0,0.15)] transition-all duration-300">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{decision.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed line-clamp-2">{decision.description} </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center gap-1.5">
                <User size={16} className="text-blue-500" />
                <span className="font-medium text-gray-700">{decision.profiles?.fullname?.[0]?.toUpperCase() || decision.profiles?.email?.[0]?.toUpperCase() || '?'} Space Explore</span>
              </div>
              {decision.decision_expired &&
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-blue-500" />
                  {decision.decision_expired && new Date(decision.decision_expired) <= new Date() && (
                    <time className="font-medium text-gray-700">{formatDate(new Date(decision.decision_expired))}</time>)}
                </div>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${40}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <VoteButton
                type="up"
                count={decision.votes?.up || 0}
                onClick={
                  decision.decision_expired && new Date(decision.decision_expired) <= new Date()
                    ? () => {} // No-op function
                    : () => handleVote('up') // Actual function
                }                    
                isSelected={isVoting}
                disabled={isVoting}
              />
              <div className="text-lg font-semibold text-gray-500">
              {(decision.votes?.up || 0) + (decision.votes?.down || 0)} votes
              </div>
              <VoteButton
                type="down"
                count={decision.votes?.down || 0}
                onClick={
                  decision.decision_expired && new Date(decision.decision_expired) <= new Date()
                    ? () => {} // No-op function
                    : () => handleVote('down') // Actual function
                }                
                isSelected={isVoting}
                disabled={isVoting}
              />
            </div>

          </div>

         
        </div>
      </div>
        <DecisionAnalytics decision={decision}/>
    </>
  );
}