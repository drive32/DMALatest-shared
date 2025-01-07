import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/decision/Sidebar';
import {
  MessageCircle, ThumbsUp, ThumbsDown, Share2, Search,
  TrendingUp, Filter, Bell, Image, Hash, Loader2, UserCircle
} from 'lucide-react';
// import { HowItWorks } from '../components/community/HowItWorks';
import { DecisionCard } from '../components/community/DecisionCard';
import { NewDecisionModal } from '../components/community/NewDecisionModal';
import { FeaturedDecisions } from '../components/community/FeaturedDecisions';
import { useSidebarStore } from '../store/sidebarStore';
import { useDecisions } from '../hooks/useDecisions';
import { useAuth } from '../hooks/useAuth';
import { NewDecisionCard } from '../components/community/NewDecisionCard';
import { Link } from 'react-router-dom';


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

export function CommunityDecisions() {
  const [isNewDecisionModalOpen, setIsNewDecisionModalOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const {
    communityDecisions,
    fetchCommunityDecisions,
    loadMoreDecisions,
    isLoading,
    hasMore,
    voteDecision
  } = useDecisions();
  const { user } = useAuth();
  const { isCollapsed } = useSidebarStore();
  const [loadingMore, setLoadingMore] = useState(false);

  const categories = [
    'Career', 'Finance', 'Education', 'Lifestyle', 'Technology', 'Health'
  ];

  useEffect(() => {
    fetchCommunityDecisions();
  }, []);

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

  const filteredDecisions = communityDecisions
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
          {/* Hero Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 p-12 mb-12 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <h1 className="text-4xl font-display font-bold text-white mb-4">
                Join the Conversation!
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Share your decisions, gather insights, and connect with our community.
                Your next great decision starts with a conversation.
              </p>
              <button
                onClick={() => setIsNewDecisionModalOpen(true)}
                className="btn-primary bg-white text-accent-600 hover:bg-gray-50"
              >
                Share Your Decision
              </button>
            </div>
          </motion.div> */}
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-1 col-span-4 space-y-6">
              <NewDecisionCard categories={categories} editingDecision={editingDecision} />
              {/* How It Works Section */}
              {/* <HowItWorks /> */}

              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search decisions..."
                    className="input-primary pl-12 w-full"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="input-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                    className="input-primary"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Featured Decisions */}
              <FeaturedDecisions decisions={communityDecisions.filter(d => d.featured)} />

              {/* Decision Grid */}
              <div className="grid grid-cols-6 gap-4">
                {/* <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ height: 'fit-content' }}
              className="col-start-1 col-span-1 bg-secondary rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group border-solid"
            >
              <div className="p-6">
                <h5 className="text-lg font-display mb-4 uppercase">DEV Community is a community of 2,590,046 amazing developers</h5>
                <p className="text-gray-600 mb-4 line-clamp-3">We're a place where coders share, stay up-to-date and grow their careers.</p>
                <button className="btn-secondary w-full cursor-not-allowed mb-3">Create account</button>
                <button className="btn-white w-full cursor-not-allowed border-0">Login</button>
              </div>
            </motion.div> */}
                <div className="col-start-1 col-span-6 space-y-6">
                  <AnimatePresence mode="popLayout">
                    {filteredDecisions.map((decision) => (
                      <DecisionCard
                        key={decision.id}
                        decision={decision}
                        onVote={handleVote}
                        onEdit={handleEdit}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="col-end-7 col-span-2">
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
                              src={user?.avatar}
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
                        {user?.fullName || user?.email || 'Guest User'}
                      </h2>
                    </div>
                  </div>
                  <button className="btn-primary w-full cursor-not-allowed mb-4">Profile</button>
                  <div className='mb-4'>
                    <p className="text-gray-600 mb-4 line-clamp-3">{user?.bio}</p>
                  </div>
                  <div className='mb-4'>
                    <h6 className="font-display mb-2 uppercase font-semibold">Location</h6>
                    <p className="text-gray-600 mb-4 line-clamp-3">{user?.location}</p>
                  </div>
                  <div className='mb-4'>
                    <h6 className="font-display mb-2 uppercase font-semibold">Joined</h6>
                    <p className="text-gray-600 mb-4 line-clamp-3">{user?.createdAt}</p>
                  </div>
                </div>
                {/* <div className='flex mb-4'>
                  <p className="text-gray-600 mb-4 line-clamp-3">👋 What's happening this week</p>
                </div>
                <h5 className="text-lg font-display mb-2 uppercase">Challenges 🤗</h5> */}
              </div>
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