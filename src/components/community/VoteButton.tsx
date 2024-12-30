import React from 'react';
import { Check, X } from 'lucide-react';

interface VoteButtonProps {
    count: number;
    onClick: () => void;
    type: 'up' | 'down';
    isSelected: boolean;  // Add selected state
  }

export function VoteButton({ count, onClick, type, isSelected }: VoteButtonProps) {
  const isYes = type === 'up';
  
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-8 py-3 rounded-xl
        transform transition-all duration-300
        hover:scale-105 active:scale-95 shadow-lg
        ${isYes 
          ? `bg-gradient-to-r ${isSelected ? 'from-emerald-600 to-emerald-500' : 'from-emerald-500 to-emerald-400'} 
             hover:from-emerald-600 hover:to-emerald-500 text-white` 
          : `bg-gradient-to-r ${isSelected ? 'from-rose-600 to-rose-500' : 'from-rose-500 to-rose-400'} 
             hover:from-rose-600 hover:to-rose-500 text-white`}
        ${isSelected ? 'ring-2 ring-offset-2 ring-opacity-50' : ''}
        ${isSelected ? (isYes ? 'ring-emerald-300' : 'ring-rose-300') : ''}
      `}
    >
      <span className="transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
        {isYes ? <Check size={24} /> : <X size={24} />}
      </span>
      <span className="font-semibold text-lg min-w-[2ch] text-center">{count}</span>
    </button>
  );
}