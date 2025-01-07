import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/decision/Sidebar';
import {
  MessageCircle, ThumbsUp, ThumbsDown, Share2, Search,
  TrendingUp, Filter, Bell, Image, Hash, Loader2, Sparkles,UserCircle
} from 'lucide-react';
import { HowItWorks } from '../components/community/HowItWorks';
import { DecisionFeedView } from '../components/community/DecisionFeedView';
import { NewDecisionModal } from '../components/community/NewDecisionModal';
import { FeaturedDecisions } from '../components/community/FeaturedDecisions';
import { useSidebarStore } from '../store/sidebarStore';
import { useDecisions } from '../hooks/useDecisions';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BackButton } from '@/components/common/BackButton';

interface Tag {
  id: string;
  name: string;
}

interface Decision {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  tags: Tag[];
  image?: string;
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
  created_at: string;
  category: string | null;
  image_url: string | null;
  featured?: boolean;
}

export function DecisionView() {
  const { id,userId } = useParams();

  const [isNewDecisionModalOpen, setIsNewDecisionModalOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const {
    communityDecisions,
    DesicionData,
    fetchDecisionById,
    fetchDecisionByUserId,
    loadMoreDecisions,
    isLoading,
    hasMore,
    voteDecision
  } = useDecisions();
  const { user } = useAuth();
  const {profile,fetchProfile} = useProfile();
  const { isCollapsed } = useSidebarStore();
  const [loadingMore, setLoadingMore] = useState(false);

  const categories = [
    'Career', 'Finance', 'Education', 'Lifestyle', 'Technology', 'Health'
  ];
  useEffect(() => {
    fetchDecisionById(id);
    fetchDecisionByUserId(userId);
    fetchProfile(userId);

  }, [id,userId]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
      if (!loadingMore && hasMore && !isLoading) {
        setLoadingMore(true);
        loadMoreDecisions().finally(() => setLoadingMore(false));
      }
    }
  }, [loadingMore, hasMore, isLoading, loadMoreDecisions]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getTimeOrDefault = (date: any) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  };


  const handleVote = useCallback((decisionId: string, voteType: 'up' | 'down') => {
    if (!user) {
      setShowSignIn(true);
      return;
    }
    voteDecision(decisionId, voteType);
  }, [user, voteDecision, setShowSignIn]);

  const handleEdit = (decision: Decision) => {
    setEditingDecision(decision);
    setIsNewDecisionModalOpen(true);
  };

  const filteredDecisions = DesicionData
    .filter(d => {
      // Match search query in title or description
      const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Match category if a category is selected
      const matchesCategory = !selectedCategory || (d.category && d.category === selectedCategory);

      // Return only items matching both search and category filters
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        // Sort by popularity (upvotes - downvotes)
        return (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down);
      }
      // Sort by creation time
      return getTimeOrDefault(b.createdAt) - getTimeOrDefault(a.createdAt);
    });


  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar />

      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Link to="/" className="flex items-center">
                <motion.span
                  className="text-2xl font-display font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Decikar.ai
                </motion.span>
              </Link>
            </div>
            <p className="text-gray-600 text-xl font-medium">
              Ask questions. Vote answers. Shape the future.
            </p>
          </header>
          <BackButton />
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-1 col-span-4 space-y-6">
            


              {/* Featured Decisions */}
              <FeaturedDecisions decisions={DesicionData.filter(d => d.featured)} />

              {/* Decision Grid */}
              <div className="space-y-6">
                {filteredDecisions.map((decision) => (
                  <DecisionFeedView
                    key={decision.id}
                    decision={decision}
                    onVote={handleVote}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
            <div className="col-end-7 col-span-2" >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ height: 'fit-content' }}
                className="bg-secondary rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group border-solid relative mt-1"
              >
                <div className='absolute folder'></div>
                <div className="p-4">
                  <div className="">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="relative">
                      <div className="w-12 h-12 rounded-full  flex items-center justify-center">
                      {user?.avatar ? (
                            <img
                              src={profile?.avatar}
                              alt="Profile Preview"
                              className="w-full h-full rounded-full border-1"
                            />
                          ) : (
                            <UserCircle className="w-full h-full text-accent-600 rounded border-1" /> 
                          )}
                       {/* <img src="https://blbfmoddnuoxsezajhwy.supabase.co/storage/v1/object/public/decisions/decisions/0.22878275138933013.PNG" alt="" className='w-full h-full rounded-full border-1' />
                         <UserCircle className="w-full h-full text-accent-600 rounded border-1" /> */}
                      </div>
                      </div>
                      <div className="min-w-0 flex-1 mt-4">
                      <h2 className="font-medium text-primary truncate">
                        {profile?.fullName || 'Guest User'}
                      </h2>
                    </div>
                  </div>
                  <button className="btn-primary w-full cursor-not-allowed mb-4">Profile</button>
                  <div className='mb-4'>
                    <p className="text-gray-600 mb-4 line-clamp-3">{profile?.bio}</p>
                  </div>
                  <div className='mb-4'>
                    <h6 className="font-display mb-2 uppercase font-semibold">Location</h6>
                    <p className="text-gray-600 mb-4 line-clamp-3">{profile?.country}</p>
                  </div>
                  <div className='mb-4'>
                    <h6 className="font-display mb-2 uppercase font-semibold">Joined</h6>
                    <p className="text-gray-600 mb-4 line-clamp-3">{profile?.createdAt}</p>
                  </div>
                  </div>
                  {/* <div className='flex mb-4'>
                    <p className="text-gray-600 mb-4 line-clamp-3">👋 What's happening this week</p>
                  </div>
                  <h5 className="text-lg font-display mb-2 uppercase">Challenges 🤗</h5> */}
                </div>
              </motion.div>
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ height: 'fit-content' }}
                className="mt-5 p-4 bg-secondary rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group border-solid relative mt-1"
              >
                <div className='mb-2 flex'>
                  <h6 className="font-display mb-2 mr-2 text-1xl">More from</h6>
                  <h6 className="font-display text-blue-600 mb-4 line-clamp-3 text-1xl">{profile?.fullName}</h6>
                </div>
                {communityDecisions.map((decision, index) => (
                   <Link 
                        to={`/decision/${decision.id}/${userId}`}
                        className=""
                      >
                <div className='mb-4'>
                  <p className="text-gray-600 mb-1 line-clamp-3">{decision?.title}</p>
                </div>
                </Link>
                ))}

              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-accent-600" />
        </div>
      )}

      <NewDecisionModal
        isOpen={isNewDecisionModalOpen}
        onClose={() => {
          setEditingDecision(null);
          setIsNewDecisionModalOpen(false);
        }}
        categories={categories}
        editingDecision={editingDecision}
      />
    </div>
  );
}