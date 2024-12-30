

export interface Analysis {
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  pros: string[];
  cons: string[];
}

export function analyzeVotingPattern(decision: any): Analysis {
  // const { totalVotes, yesPercentage, noPercentage } = calculateVotePercentages(
  //   decision.yesVotes,
  //   decision.noVotes
  // );
  
  // Calculate confidence based on total votes and vote difference
  const voteDifference = Math.abs(decision.yesVotes - decision.noVotes);
  const confidence = 30
  
  // Determine sentiment
  const sentiment = 'positive'

  // Generate insights based on voting patterns
  const generateInsights = () => {
    const strongConsensus = confidence > 70;
    const moderateConsensus = confidence > 40;
    
    const pros = [];
    const cons = [];

    pros.push("Supporting minority shows potential for specific use cases");
    cons.push("Minor concerns exist but don't significantly impact overall sentiment");
   

    return { pros, cons };
  };

  const { pros, cons } = generateInsights();

  return {
    confidence,
    sentiment,
    pros,
    cons
  };
}