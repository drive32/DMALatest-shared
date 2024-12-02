export const CATEGORIES = [
  'Career',
  'Finance',
  'Education',
  'Lifestyle',
  'Technology',
  'Health'
] as const;

export const DECISION_STATUS = {
  PENDING: 'pending',
  DECIDED: 'decided',
  COMPLETED: 'completed'
} as const;

export const VOTE_TYPE = {
  UP: 'up',
  DOWN: 'down'
} as const;

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DECISIONS: 'decisions'
} as const;