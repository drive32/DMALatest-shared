import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { FloatingCTA } from '../components/FloatingCTA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <FloatingCTA />
      <Footer />
    </div>
  );
}