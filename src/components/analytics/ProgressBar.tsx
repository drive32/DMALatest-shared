import React from 'react';

interface ProgressBarProps {
  value: number;
  gradientFrom: string;
  gradientTo: string;
}

export function ProgressBar({ value, gradientFrom, gradientTo }: ProgressBarProps) {
  return (
    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}