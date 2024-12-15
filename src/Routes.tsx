import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CommunityDecisions } from './pages/CommunityDecisions';
import {DecisionView} from './pages/DecisionView';
import { AIDecisionPage } from './pages/AIDecisionPage';
import { Profile } from './pages/Profile';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/community" element={<CommunityDecisions />} />
      <Route path="/decision/:id" element={<DecisionView />} />
      <Route path="/ai-decision" element={<AIDecisionPage />} />
      <Route path="/profile" element={<Profile />} />
    </RouterRoutes>
  );
}