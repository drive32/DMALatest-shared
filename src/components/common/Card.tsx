import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.12)] p-8 ${className}`}>
      {children}
    </div>
  );
}