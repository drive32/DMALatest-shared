export interface Decision {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  status: 'pending' | 'decided' | 'completed';
  aiRecommendations: Recommendation[];
  collaborators: Collaborator[];
  finalDecision?: string;
  outcome?: string;
  quantitativeFactors: QuantitativeFactor[];
  qualitativeFactors: QualitativeFactor[];
  preferences: Preference[];
  deadline?: Date;
}

export interface QuantitativeFactor {
  id: string;
  name: string;
  value: number;
  unit: string;
  type: 'cost' | 'benefit' | 'neutral';
}

export interface QualitativeFactor {
  id: string;
  category: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface Preference {
  id: string;
  factor: string;
  weight: number;
  mustHave: boolean;
}

export interface Recommendation {
  id: string;
  text: string;
  pros: string[];
  cons: string[];
  confidenceScore: number;
  votes: number;
  comments: Comment[];
  matchScore?: number;
}

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  joinedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
}