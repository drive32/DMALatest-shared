import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Question } from '../../types';
import { Card } from '../common/Card';
import { GradientText } from '../common/GradientText';
import { SentimentIndicator } from './SentimentIndicator';
import { InsightsList } from './InsightsList';
import { analyzeVotingPattern } from '../../utils/analysisUtils';

interface VoteAnalysisProps {
  question: Question;
}

export function VoteAnalysis({ question }: VoteAnalysisProps) {
  const analysis = analyzeVotingPattern(question);

  return (
    <Card className="mt-8">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb size={24} className="text-yellow-500" />
        <h2 className="text-2xl font-bold">
          <GradientText from="from-yellow-600" to="to-orange-600">
            AI-Powered Analysis
          </GradientText>
        </h2>
      </div>

      <div className="space-y-8">
        <SentimentIndicator 
          sentiment={analysis.sentiment}
          confidence={analysis.confidence}
        />
        <InsightsList 
          pros={analysis.pros}
          cons={analysis.cons}
        />
      </div>
    </Card>
  );
}