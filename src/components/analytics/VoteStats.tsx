import React from 'react';
import { ProgressBar } from './ProgressBar';

interface VoteStatsProps {
  label: string;
  count: number;
  percentage: number;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
}

export function VoteStats({ 
  label, 
  count, 
  percentage, 
  gradientFrom, 
  gradientTo,
  textColor 
}: VoteStatsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-gray-700">{label}</span>
        <span className={`text-xl font-bold ${textColor}`}>{count}</span>
      </div>
      <ProgressBar 
        value={percentage} 
        gradientFrom={gradientFrom} 
        gradientTo={gradientTo} 
      />
      <span className="text-sm font-medium text-gray-500">
        {percentage.toFixed(1)}% of total votes
      </span>
    </div>
  );
}