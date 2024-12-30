import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
}

export function GradientText({ 
  children, 
  from = 'from-blue-600', 
  to = 'to-purple-600',
  className = '' 
}: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r ${from} ${to} text-transparent bg-clip-text ${className}`}>
      {children}
    </span>
  );
}