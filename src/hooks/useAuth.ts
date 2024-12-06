import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { getAuthErrorMessage } from '../utils/errorHandling';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


interface User {
  id: string;
  email: string;
  fullName: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  sessionTimeout: number | null;
  lastActivity: number | null;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: string | null; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshSession: () => Promise<void>;
  checkSession: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  sessionTimeout: null,
  lastActivity: null,

  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        if (error.message === 'refresh_token_not_found') {
          // Clear invalid session state
          set({ user: null, sessionTimeout: null, lastActivity: null });
          return;
        }
        throw error;
      }
      
      if (session) {
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession();
        
        if (refreshError) throw refreshError;
        if (!refreshedSession) throw new Error('Failed to refresh session');
        
        set({ lastActivity: Date.now() });
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      await supabase.auth.signOut();
      set({ user: null, sessionTimeout: null, lastActivity: null });
    }
  },

  checkSession: () => {
    const state = useAuth.getState();
    const { lastActivity, sessionTimeout } = state;
    
    if (lastActivity && sessionTimeout) {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity > sessionTimeout) {
        state.signOut();
      }
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });
      
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { 
          user: null, 
          error: 'This email is already registered. Please sign in instead.' 
        };
      }
      
      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      if (!authUser) {
        throw new Error('Failed to create user account');
      }

      // Create initial profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authUser.id,
        fullname: null,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_onboarded: false
      });
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails - we can retry later
      }
      
      const user = {
        id: authUser.id,
        email: authUser.email || '',
        fullName: null
      };
      
      set({ user });
      return { 
        user, 
        error: null,
        message: 'Account created successfully!'
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: getAuthErrorMessage(error) };
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
     // Call Supabase signInWithPassword
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const { data, error } = result;

    if (error) throw error;
    if (!data.user) throw new Error('Invalid credentials');

 // Get profile data
    const { data: profileData } = await supabase
                              .from('profiles')
                              .select('fullname')
                              .eq('id', data.user.id)
                              .single();
    // Save session manually if persistSession is true
    if (data.session) {
      await AsyncStorage.setItem('supabase-session', JSON.stringify(data.session));
    }
    const user = {
      id: data.user.id,
      email: data.user.email || '',
      fullName: profileData?.fullname || null
    };

    set({ 
      user,
      lastActivity: Date.now(),
      sessionTimeout: 3600000 // 1 hour
    });
    return { user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: getAuthErrorMessage(error) };
    }
  },

  signOut: async () => {

    try {

      const sessionString = await AsyncStorage.getItem('supabase-session');
      if (!sessionString) throw new Error('Authentication required');
      const session = JSON.parse(sessionString);

      const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session?.access_token}`, // Replace with the current access token
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      await AsyncStorage.removeItem('supabase-session');
      // Clear all state
      set({ 
        user: null,
        sessionTimeout: null,
        lastActivity: null
      });
      
      return { error: null };

    } catch (error) {
      throw new Error('Failed to log out');
    }
  }
}));