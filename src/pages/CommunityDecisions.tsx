import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/decision/Sidebar';
import { 
  MessageCircle, ThumbsUp, ThumbsDown, Share2, Search, 
  TrendingUp, Filter, Bell, Image, Hash, Loader2
} from 'lucide-react';
import { HowItWorks } from '../components/community/HowItWorks';
import { DecisionCard } from '../components/community/DecisionCard';
import { NewDecisionModal } from '../components/community/NewDecisionModal';
import { FeaturedDecisions } from '../components/community/FeaturedDecisions';
import { useSidebarStore } from '../store/sidebarStore';
import { useDecisions } from '../hooks/useDecisions';
import { useAuth } from '../hooks/useAuth';

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
      const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || d.tags.some(t => t.name === selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down);
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
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
          </motion.div>

          {/* How It Works Section */}
          <HowItWorks />

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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