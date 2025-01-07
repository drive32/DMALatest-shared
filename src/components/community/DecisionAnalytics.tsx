import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { Decision } from '../../types';
import { Card } from '../../components/common/Card';
import { GradientText } from '../../components/common/GradientText';
import { StatCard } from '../analytics/StatCard';
import { VoteStats } from '../analytics/VoteStats';
import { SentimentIndicator } from '../analytics/SentimentIndicator';
import { InsightsList } from '../analytics/InsightsList';
import { calculateVotePercentages } from '../../utils/voteUtils';
import { analyzeVotingPattern } from '../../utils/analysisUtils';

// interface DecisionAnalyticsProps {
//   decision: Decision;
// }

export function DecisionAnalytics({ decision }:any) {
  // const { totalVotes, yesPercentage, noPercentage } = calculateVotePercentages(
  //   decision.votes?.up,
  //   decision.votes?.down
  // );
  const analysis = analyzeVotingPattern(decision);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 size={24} className="text-purple-500" />
        <h2 className="text-2xl font-bold">
          <GradientText from="from-purple-600" to="to-pink-600">
            Vote Analytics
          </GradientText>
        </h2>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <VoteStats
            label="Yes Votes"
            count={decision.votes?.up || 0}
            percentage={100}
            gradientFrom="from-emerald-500"
            gradientTo="to-emerald-400"
            textColor="text-emerald-600"
          />
          <VoteStats
            label="No Votes"
            count={decision.votes?.down || 0}
            percentage={50}
            gradientFrom="from-rose-500"
            gradientTo="to-rose-400"
            textColor="text-rose-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StatCard
            icon={Users}
            value={(decision.votes?.up || 0) + (decision.votes?.down || 0)}
            label="Total Votes"
          />
          <StatCard
            icon={TrendingUp}
            value={(decision.votes?.up || 0) - (decision.votes?.down || 0)}
            label="Vote Difference"
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            textColor="text-purple-700"
          />
        </div>

        <div className="border-t border-gray-100 pt-8">
          <SentimentIndicator 
            sentiment={analysis.sentiment}
            confidence={analysis.confidence}
          />
          <div className="mt-6">
            <InsightsList 
              pros={analysis.pros}
              cons={analysis.cons}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}