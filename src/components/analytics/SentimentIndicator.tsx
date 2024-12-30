import React from 'react';
import { ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react';

interface SentimentIndicatorProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export function SentimentIndicator({ sentiment, confidence }: SentimentIndicatorProps) {
  const getIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="text-emerald-500" />;
      case 'negative':
        return <ThumbsDown className="text-rose-500" />;
      default:
        return <MinusCircle className="text-blue-500" />;
    }
  };

  const getLabel = () => {
    const strength = confidence > 70 
      ? 'Strong' 
      : confidence > 40 
        ? 'Moderate' 
        : 'Weak';
        
    return `${strength} ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Sentiment`;
  };

  return (
    <div className="flex items-center gap-2 text-lg font-medium">
      {getIcon()}
      <span>{getLabel()}</span>
      <span className="text-sm text-gray-500">
        ({confidence.toFixed(1)}% confidence)
      </span>
    </div>
  );
}