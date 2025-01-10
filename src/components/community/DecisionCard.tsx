import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import {  Clock,  User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDecisions } from '../../hooks/useDecisions';
import { toast } from 'sonner';
import { formatDate } from '../../utils/dateUtils'

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
  profiles?: { fullname?: string; email?: string; avatar:string };
}

interface Props {
  decision: Decision;
  onVote: (decisionId: string, voteType: 'up' | 'down') => void;
  onEdit: (decision: Decision) => void;
}

export function DecisionCard({ decision, onVote, onEdit }: Props) {
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="block w-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.12)] p-8 hover:shadow-[0_0_50px_-6px_rgb(0,0,0,0.15)] transition-all duration-300 group"
    >
       {decision.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={decision.image_url}
            alt=""
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
          <Link 
      to={`/decision/${decision.id}/${decision.user_id}`}
      className=""
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{decision.title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed line-clamp-2 ">{decision.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center gap-1.5">
              <User size={16} className="text-blue-500" />
              <span className="font-medium text-gray-700">{decision.profiles?.fullname?.[0]?.toUpperCase() || decision.profiles?.email?.[0]?.toUpperCase() || '?'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-blue-500" />
              <time className="font-medium text-gray-700">{formatDate(new Date(decision.created_at))}</time>
            </div>
          </div>
          
          {/* <div className="flex items-center gap-2 text-blue-600 font-medium">
            View Discussion
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div> */}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {decision.votes?.up || 0} votes
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            View Discussion
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform text-blue-600" />
          </div>
        </div>
      </div>
    </Link>
      {/* {decision.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={decision.image_url}
            alt=""
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )} */}

      {/* <div className="p-6">
        <Link to={`/decision/${decision.id}`}>
          <h2 className="text-lg font-display font-bold text-primary mb-2 capitalize">
            {decision.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {decision.description}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center">
            {decision.profiles?.avatar ? (
              <img 
                src={decision.profiles.avatar} 
                alt={decision.profiles.fullname || 'User'} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-accent-600">
                {decision.profiles?.fullname?.[0]?.toUpperCase() || decision.profiles?.email?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-primary">
              {decision.profiles?.fullname || decision.profiles?.email || 'Anonymous'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(decision.created_at))} ago</span>
            </div>
          </div>
          {user?.id === decision.user_id && (
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(decision)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center gap-2 w-full px-4 py-2 text-left text-sm`}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Decision
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Decision
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div> */}

        {/* <div className="flex flex-wrap gap-2 mb-4">
          {decision.category && (
            <span className="px-3 py-1 rounded-full text-sm bg-accent-50 text-accent-600">
              {decision.category}
            </span>
          )}
        </div> */}
        {/* <div className="flex flex-wrap gap-2 mb-4">
          {decision.decision_expired && new Date(decision.decision_expired) <= new Date() && (
            <span className="text-red-500 font-bold ml-4">Poll Completed</span>
          )}
        </div> */}

        

        {/* <div className="flex items-center gap-4">
          <button
            onClick={
              decision.decision_expired && new Date(decision.decision_expired) <= new Date()
                ? undefined // Remove onClick if expired
                : () => handleVote('up') // Add onClick otherwise
            }
            disabled={isVoting}
            className={`btn-secondary flex items-center gap-2 ${
              isVoting || (decision.decision_expired && new Date(decision.decision_expired) <= new Date())
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{decision.votes?.up || 0}</span>
          </button>
          <button
            onClick={
              decision.decision_expired && new Date(decision.decision_expired) <= new Date()
                ? undefined // Remove onClick if expired
                : () => handleVote('down') // Add onClick otherwise
            }
            disabled={isVoting}
            className={`btn-secondary flex items-center gap-2 ${
              isVoting || (decision.decision_expired && new Date(decision.decision_expired) <= new Date())
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{decision.votes?.down || 0}</span>
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{decision.comments?.length || 0}</span>
          </button>
          <button className="btn-secondary flex items-center gap-2 ml-auto">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          
        </div> */}


      {/* </div> */}
    </motion.div>
  );
}