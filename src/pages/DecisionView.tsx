import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/decision/Sidebar';
import { 
  MessageCircle, ThumbsUp, ThumbsDown, Share2, Search, 
  TrendingUp, Filter, Bell, Image, Hash, Loader2
} from 'lucide-react';
import { HowItWorks } from '../components/community/HowItWorks';
import { DecisionFeedView } from '../components/community/DecisionFeedView';
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
  created_at: string;
  category: string | null;
  image_url: string | null;
  featured?: boolean;
}

export function DecisionView() {
  const { id } = useParams();
  const [isNewDecisionModalOpen, setIsNewDecisionModalOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const { 
    DesicionData, 
    fetchDecisionById, 
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
    fetchDecisionById(id);
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
             
            </div>
          </motion.div>


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