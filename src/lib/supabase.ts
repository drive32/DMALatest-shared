import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/supabase'; // Adjust the path as needed

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Singleton instance for Supabase client
let supabase: SupabaseClient<Database> | null = null;

/**
 * Function to initialize or retrieve the Supabase client.
 * Avoids creating a new client if there's already a session in storage.
 */
export const getSupabaseClient = async (): Promise<SupabaseClient<Database>> => {
  console.info('Restoring session...');

  if (!supabase) {
    const storedSession = await AsyncStorage.getItem('supabase-session');

    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      console.info('Restoring session...');
      supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: AsyncStorage,
        },
      });

      // Restore session explicitly
      await supabase.auth.setSession(parsedSession);
    } else {
      console.info('No session found1. Initializing Supabase client...');
      supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: AsyncStorage,
        },
      });
    }
  }else{
    console.info('No session found2. Initializing Supabase client...');
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        storage: AsyncStorage,
      },
    });
  }

  return supabase;
};
