import { create } from 'zustand';
import { Decision } from './types';

interface DecisionStore {
  decisions: Decision[];
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'status' | 'aiRecommendations' | 'collaborators'>) => void;
  updateDecision: (id: string, decision: Partial<Decision>) => void;
  addCollaborator: (decisionId: string, email: string, name: string) => void;
  voteRecommendation: (decisionId: string, recommendationId: string, value: number) => void;
  addComment: (decisionId: string, recommendationId: string, text: string) => void;
}

export const useStore = create<DecisionStore>((set) => ({
  decisions: [],
  addDecision: (newDecision) => set((state) => ({
    decisions: [...state.decisions, {
      ...newDecision,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: 'pending',
      aiRecommendations: [],
      collaborators: [],
      quantitativeFactors: newDecision.quantitativeFactors || [],
      qualitativeFactors: newDecision.qualitativeFactors || [],
      preferences: newDecision.preferences || []
    }]
  })),
  updateDecision: (id, updatedDecision) => set((state) => ({
    decisions: state.decisions.map(d => 
      d.id === id ? { ...d, ...updatedDecision } : d
    )
  })),
  addCollaborator: (decisionId, email, name) => set((state) => ({
    decisions: state.decisions.map(d => 
      d.id === decisionId ? {
        ...d,
        collaborators: [...d.collaborators, {
          id: crypto.randomUUID(),
          email,
          name,
          joinedAt: new Date()
        }]
      } : d
    )
  })),
  voteRecommendation: (decisionId, recommendationId, value) => set((state) => ({
    decisions: state.decisions.map(d => 
      d.id === decisionId ? {
        ...d,
        aiRecommendations: d.aiRecommendations.map(r =>
          r.id === recommendationId ? { ...r, votes: r.votes + value } : r
        )
      } : d
    )
  })),
  addComment: (decisionId, recommendationId, text) => set((state) => ({
    decisions: state.decisions.map(d => 
      d.id === decisionId ? {
        ...d,
        aiRecommendations: d.aiRecommendations.map(r =>
          r.id === recommendationId ? {
            ...r,
            comments: [...r.comments, {
              id: crypto.randomUUID(),
              userId: 'current-user',
              text,
              createdAt: new Date()
            }]
          } : r
        )
      } : d
    )
  }))
}));