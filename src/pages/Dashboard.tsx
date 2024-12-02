import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/decision/Sidebar';
import { 
  MessageCircle, ThumbsUp, ThumbsDown, Users, BarChart2, 
  Calendar, TrendingUp, Filter, Download, Settings,
  Bell, Search, UserCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useDecisions } from '../hooks/useDecisions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { formatDistanceToNow } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  const { user } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const { decisions, fetchDecisions } = useDecisions();
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
      fetchDecisions();
    }
  }, [user, fetchDecisions]);

  const votingTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Upvotes',
        data: decisions.slice(0, 7).map(d => d.votes?.up || 0),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.3
      },
      {
        label: 'Downvotes',
        data: decisions.slice(0, 7).map(d => d.votes?.down || 0),
        borderColor: '#FF5252',
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        tension: 0.3
      }
    ]
  };

  const categoryDistributionData = {
    labels: Array.from(new Set(decisions.map(d => d.category || 'Other'))),
    datasets: [{
      data: Array.from(new Set(decisions.map(d => d.category || 'Other')))
        .map(category => decisions.filter(d => (d.category || 'Other') === category).length),
      backgroundColor: [
        '#4CAF50',
        '#66BB6A',
        '#81C784',
        '#A5D6A7',
        '#C8E6C9'
      ]
    }]
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.fullName || 'Profile'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-10 h-10 text-accent-600" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent-500 rounded-full border-2 border-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-primary">
                    {profile?.fullName || user?.email || 'Welcome!'}
                  </h2>
                  <p className="text-gray-600">
                    Active Member
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button className="text-sm text-accent-600 hover:underline">
                      Edit Profile
                    </button>
                    <span className="text-gray-300">•</span>
                    <button className="text-sm text-accent-600 hover:underline">
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 grid grid-cols-3 gap-4"
            >
              <div className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 text-accent-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Decisions</span>
                </div>
                <p className="mt-2 text-2xl font-display font-bold text-primary" data-testid="total-decisions">
                  {decisions.length}
                </p>
              </div>

              <div className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 text-accent-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Comments</span>
                </div>
                <p className="mt-2 text-2xl font-display font-bold text-primary" data-testid="total-comments">
                  {decisions.reduce((acc, d) => acc + (d.comments?.length || 0), 0)}
                </p>
              </div>

              <div className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 text-accent-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Participants</span>
                </div>
                <p className="mt-2 text-2xl font-display font-bold text-primary" data-testid="total-participants">
                  {decisions.reduce((acc, d) => acc + (d.collaborators?.length || 0), 0)}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Voting Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-display font-bold text-primary mb-4">
                Voting Trends
              </h3>
              <Line 
                data={votingTrendsData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-display font-bold text-primary mb-4">
                Decision Categories
              </h3>
              <div className="h-[300px] flex items-center justify-center">
                <Pie 
                  data={categoryDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Recent Decisions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-secondary rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-primary">
                Recent Decisions
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search decisions..."
                    className="input-primary pl-10"
                  />
                </div>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="input-primary"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <button className="btn-primary flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {decisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-accent-50 hover:bg-accent-100 transition-colors cursor-pointer" 
                  data-testid="decision-card"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-primary">
                      {decision.title}
                    </h4>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-600">
                      {decision.category}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{decision.votes?.up || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{decision.votes?.down || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{decision.comments?.length || 0} comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{decision.collaborators?.length || 0} participants</span>
                    </div>
                    <span>
                      {formatDistanceToNow(new Date(decision.created_at))} ago
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}