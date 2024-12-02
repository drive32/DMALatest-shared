import { AuthError } from '@supabase/supabase-js';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.status) {
      case 400:
        if (error.message?.toLowerCase().includes('password')) {
          return 'Password must be at least 6 characters long';
        } else if (error.message?.toLowerCase().includes('email')) {
          return 'Please enter a valid email address';
        }
        return 'Invalid input. Please check your details.';
      case 401:
        return 'Invalid credentials';
      case 422:
        if (error.message?.toLowerCase().includes('email')) {
          return 'This email is already registered. Please sign in instead.';
        }
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many attempts. Please try again later';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): string {
  console.error('Error:', error);
  return getAuthErrorMessage(error);
}