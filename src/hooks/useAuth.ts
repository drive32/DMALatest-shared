import { create } from 'zustand';
import { getSupabaseClient } from '../lib/supabase';
import { getAuthErrorMessage } from '../utils/errorHandling';
import AsyncStorage from '@react-native-async-storage/async-storage';


const forgotRedirectionUrl = import.meta.env.VITE_FORGOT_PASSWORD_REDIRECT_URL;


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
  setUser: (user: User | null) => void;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: string | null; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  forgotPassword: (email: string) => Promise<{ error: string | null,message?: string }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshSession: () =>  Promise<{ user: User | null }>;
  checkSession: () => void;
}

export const useAuth = create<AuthState>((set,get) => ({
  user: null,
  loading: false,
  sessionTimeout: null,
  lastActivity: null,

  setUser: (user) => set({ user }),

  refreshSession: async (): Promise<{ user: User | null }> => {
    const supabase = await getSupabaseClient();
  
    try {
      console.log('Fetching session...');
      const { data: { session }, error } = await supabase.auth.getSession();
  
      if (error) {
        console.error('Error fetching session:', error);
  
        if (error.message === 'refresh_token_not_found') {
          // Clear invalid session state
          set({ user: null, sessionTimeout: null, lastActivity: null });
          return { user: null };
        }
  
        throw error; // Ensure proper error handling
      }
  
      if (session) {
        console.log('Session found, attempting refresh...');
        const { data: { session: refreshedSession }, error: refreshError } =
          await supabase.auth.refreshSession();
  
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          throw refreshError;
        }
  
        if (!refreshedSession) {
          throw new Error('Failed to refresh session');
        }
  
        console.log('Session refreshed successfully:', refreshedSession);
  
        // Extract user data
        const refreshedUser = refreshedSession.user;
        const { data: profileData } = await supabase
          .from('profiles')
          .select('fullname')
          .eq('id', refreshedUser.id)
          .single();
  
        const user: User = {
          id: refreshedUser.id,
          email: refreshedUser.email || '',
          fullName: profileData?.fullname || null,
        };
  
        set({
          user,
          lastActivity: Date.now(),
          sessionTimeout: 3600000, // 1 hour
        });
  
        return { user };
      }
  
      // No session available
      return { user: null };
    } catch (error) {
      console.error('Session refresh error:', error);
  
      await supabase.auth.signOut();
      set({ user: null, sessionTimeout: null, lastActivity: null });
  
      // Return null in case of error
      return { user: null };
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
    const supabase = await getSupabaseClient();
    const { signIn } = get();

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
        updated_at: new Date().toISOString()
      });
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails - we can retry later
      }

       // Automatically call signIn after successful signUp
    const signInResult = await signIn(email, password);

    if (signInResult.error) {
      throw new Error('Account created, click login to continuee...');
    }

    return { user: signInResult.user, error: null,message: 'Account created successfully!' };

    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: getAuthErrorMessage(error) };
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const supabase = await getSupabaseClient();

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


  forgotPassword: async (email: string) => {
    const supabase = await getSupabaseClient();

    try {

          // First check if user already exists
          const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();
  
        if (!existingUser) {
          return { 
            error: 'This email is not available.' 
          };
        }
  
     // Call Supabase signInWithPassword
     const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: forgotRedirectionUrl,
    });
    return { error: null };
    } catch (error) {
      console.error('Forgot password in error:', error);
      return { user: null, error: getAuthErrorMessage(error) };
    }
  },

  signOut: async () => {
    const supabase = await getSupabaseClient();
    console.log("logout step 1");
    try {
      // Clear any stored session data
      localStorage.removeItem('sb-blbfmoddnuoxsezajhwy-auth-token');
      sessionStorage.clear();
      console.log("logout step 2");

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });

      console.log("logout step 3");
      
      if (error) throw error;
      
      // Clear all state
      set({ 
        user: null,
        sessionTimeout: null,
        lastActivity: null
      });
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: getAuthErrorMessage(error) };
    }
  }
}));