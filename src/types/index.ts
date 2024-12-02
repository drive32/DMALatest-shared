// Shared types across the application
export interface BaseResponse {
  error: string | null;
  message?: string;
}

export interface AuthResponse extends BaseResponse {
  user: User | null;
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
}

export interface Profile {
  id: string;
  fullName: string | null;
  gender: 'male' | 'female' | 'other' | null;
  country: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  bio: string | null;
  avatar: string | null;
}

export interface Decision {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'decided' | 'completed';
  category: string | null;
  image_url: string | null;
  deadline: string | null;
  is_private: boolean;
  is_featured: boolean;
  view_count: number;
  ai_recommendation: string | null;
  final_decision: string | null;
  outcome: string | null;
  votes?: {
    up: number;
    down: number;
  };
  comments?: Array<Comment>;
}

export interface Comment {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
  is_edited: boolean;
}