import { Question } from '../types';

export const calculateVotePercentages = (yesVotes: number, noVotes: number) => {
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  return {
    totalVotes,
    yesPercentage,
    noPercentage,
  };
};

export const handleVoteChange = (
  question: Question, 
  voteType: 'yes' | 'no', 
  userId: string
): Question => {
  const previousVote = question.userVotes[userId];
  const newVotes = { ...question.userVotes, [userId]: voteType };

  // Calculate new vote counts
  let yesVotes = question.yesVotes;
  let noVotes = question.noVotes;

  // Remove previous vote if exists
  if (previousVote === 'yes') yesVotes--;
  if (previousVote === 'no') noVotes--;

  // Add new vote
  if (voteType === 'yes') yesVotes++;
  if (voteType === 'no') noVotes++;

  return {
    ...question,
    yesVotes,
    noVotes,
    userVotes: newVotes
  };
};