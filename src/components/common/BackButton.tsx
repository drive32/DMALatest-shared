import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/')}
      className="inline-flex items-center gap-3 cursor-pointer group mb-8"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-md scale-125 opacity-0 group-hover:opacity-50 transition-all duration-300" />
        <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
          <ArrowLeft 
            size={16} 
            className="text-white transform group-hover:-translate-x-0.5 transition-all duration-300" 
          />
        </div>
      </div>
      <span className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Back to Discussion
      </span>
    </div>
  );
}