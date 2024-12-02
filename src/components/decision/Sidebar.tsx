import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Home, Settings, LogOut, UserCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSidebarStore } from '../../store/sidebarStore';
import { toast } from 'sonner';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Failed to sign out');
        return;
      }
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/ai-decision', icon: Brain, label: 'AI Decision Maker' },
    { path: '/profile', icon: Settings, label: 'Profile' },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: isCollapsed ? '5rem' : '16rem',
      }}
      className="bg-secondary h-screen fixed left-0 top-0 border-r border-gray-200 shadow-lg z-50"
    >
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 bg-accent-500 text-white p-1 rounded-full shadow-lg hover:bg-accent-600 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Profile Section */}
      <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'items-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-accent-600" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500 rounded-full border-2 border-secondary" />
          </div>
          {!isCollapsed && <div className="min-w-0 flex-1">
            <h2 className="font-medium text-primary truncate">
              {user?.fullName || user?.email || 'Guest User'}
            </h2>
            <span className="text-sm text-gray-500">Online</span>
          </div>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-accent-50 text-accent-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </nav>

      {/* Pro Badge */}
      {!isCollapsed && <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-4 rounded-lg text-white">
          <p className="text-sm font-medium">Upgrade to Pro</p>
          <p className="text-xs mt-1 opacity-90">Get access to advanced features</p>
        </div>
      </div>}
    </motion.div>
  );
}