import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link to="/contact" className="hover:text-accent-600 transition-colors">
              Contact
            </Link>
            <Link to="/support" className="hover:text-accent-600 transition-colors">
              Support
            </Link>
          </div>
          
          <div className="text-sm text-gray-600">
            © 2024 Decikar.ai. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}