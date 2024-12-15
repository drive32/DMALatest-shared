import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ensure environment variables are properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables (URL or Key) are missing.');
}

// Singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Retrieves the Supabase client instance.
 * Initializes the instance if it doesn't already exist.
 *
 * @returns {SupabaseClient<Database>} - The Supabase client instance.
 */
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    console.log('Initializing Supabase client...');
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true, // Automatically refreshes the token when it expires
        persistSession: true,  // Persists session data in AsyncStorage
        detectSessionInUrl: false, // Prevents session handling from interfering with deep links
        storage: AsyncStorage, // Use AsyncStorage for session storage in React Native
      },
      global: {
        headers: {
          'Cache-Control': 'no-cache', // Prevents caching
          'Pragma': 'no-cache',       // Ensures up-to-date requests
        },
      },
    });
  }

  return supabaseInstance;
};
