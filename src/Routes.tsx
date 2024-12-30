import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CommunityDecisions } from './pages/CommunityDecisions';
import {DecisionView} from './pages/DecisionView';
import { AIDecisionPage } from './pages/AIDecisionPage';
import { Profile } from './pages/Profile';
import { ResetPassword } from './pages/ResetPassword';
import { SignIn } from './pages/Signin';
import { SignUp } from './pages/Sigup';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/community" element={<CommunityDecisions />} />
      <Route path="/decision/:id" element={<DecisionView />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/ai-decision" element={<AIDecisionPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </RouterRoutes>
  );
}