import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Analysis() {
  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900">
      <Header />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1>Analysis</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}