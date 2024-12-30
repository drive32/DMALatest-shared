import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { MessageCircle, ThumbsUp, ThumbsDown, Share2, Clock, MoreVertical, Edit2, Trash2, User } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
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
  const { deleteDecision, fetchDecisionCountByGender } = useDecisions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [genderCounts, setGenderCounts] = useState<any>(null); // State to store the result

  useEffect(() => {
    console.log("decision id :" + decision.id);

    const fetchData = async () => {
      try {
        const result = await fetchDecisionCountByGender(decision.id); // Fetch data
        setGenderCounts(result); // Store the result in state
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error message:", err.message);
        } else {
          console.error("Unknown error:", err);
        }
      }
    };

    if (decision.id) {
      fetchData(); // Fetch data when decision id is available
    }
  }, [decision.id]); // Re-run when decision.id changes


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
  // const totalVotes = decision.yesVotes + decision.noVotes;
  // const yesPercentage = totalVotes > 0 ? (decision.yesVotes / totalVotes) * 100 : 0;


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
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{decision.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed line-clamp-2">{decision.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed beatae nisi ex, explicabo, eius voluptas dolores rem enim natus eaque labore sequi recusandae possimus vero culpa esse, velit aspernatur molestias!</p>
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
                onClick={() => onVote(decision.id, 'up')}
                isSelected={true}
              />
              <div className="text-lg font-semibold text-gray-500">
                1 votes
              </div>
              <VoteButton
                type="down"
                count={decision.votes?.down || 0}
                onClick={() => onVote(decision.id, 'down')}
                isSelected={false}
              />
            </div>

          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={
                decision.decision_expired && new Date(decision.decision_expired) <= new Date()
                  ? undefined // Remove onClick if expired
                  : () => handleVote('up') // Add onClick otherwise
              }
              disabled={isVoting}
              className={`btn-secondary flex items-center gap-2 ${isVoting || (decision.decision_expired && new Date(decision.decision_expired) <= new Date())
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
              className={`btn-secondary flex items-center gap-2 ${isVoting || (decision.decision_expired && new Date(decision.decision_expired) <= new Date())
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
            <button className="btn-secondary flex items-center gap-2">
              Male <ThumbsUp className="w-4 h-4" />
              <span>{genderCounts?.male?.up || 0}</span>
            </button>
            <button className="btn-secondary flex items-center gap-2">
              Female <ThumbsUp className="w-4 h-4" />
              <span>{genderCounts?.female?.up || 0}</span>
            </button>
            <button className="btn-secondary flex items-center gap-2 ml-auto">
              <Share2 className="w-4 h-4" />
              Share
            </button>

          </div>
        </div>
      </div>
        <DecisionAnalytics decision={decision}/>
      {/* <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group"
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

        <div className="p-6">
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
                        className={`${active ? 'bg-gray-100' : ''
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
                        className={`${active ? 'bg-gray-100' : ''
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
          </div>


          <Link to={`/decision/${decision.id}`}>
            <h2 className="text-lg font-display font-bold text-primary mb-2">
              {decision.title}
            </h2>
          </Link>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {decision.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {decision.category && (
              <span className="px-3 py-1 rounded-full text-sm bg-accent-50 text-accent-600">
                {decision.category}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {decision.decision_expired && new Date(decision.decision_expired) <= new Date() && (
              <span className="text-red-500 font-bold ml-4">Poll Completed</span>
            )}
          </div>



          <div className="flex items-center gap-4">
            <button
              onClick={
                decision.decision_expired && new Date(decision.decision_expired) <= new Date()
                  ? undefined // Remove onClick if expired
                  : () => handleVote('up') // Add onClick otherwise
              }
              disabled={isVoting}
              className={`btn-secondary flex items-center gap-2 ${isVoting || (decision.decision_expired && new Date(decision.decision_expired) <= new Date())
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
              className={`btn-secondary flex items-center gap-2 ${isVoting || (decision.decision_expired && new Date(decision.decision_expired) <= new Date())
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
            <button className="btn-secondary flex items-center gap-2">
              Male <ThumbsUp className="w-4 h-4" />
              <span>{genderCounts?.male?.up || 0}</span>
            </button>
            <button className="btn-secondary flex items-center gap-2">
              Female <ThumbsUp className="w-4 h-4" />
              <span>{genderCounts?.female?.up || 0}</span>
            </button>
            <button className="btn-secondary flex items-center gap-2 ml-auto">
              <Share2 className="w-4 h-4" />
              Share
            </button>

          </div>


        </div>
      </motion.div> */}
    </>
  );
}