import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSupabaseClient } from '../lib/supabase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = getSupabaseClient();
  
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
  
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }
  
        if (session?.user) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('fullname')
            .eq('id', session.user.id)
            .single();
  
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile data:', profileError);
          }
  
          useAuth.setState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              fullName: profileData?.fullname || null,
            },
          });
        } else {
          useAuth.setState({ user: null });
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        useAuth.setState({ user: null });
      }
    };
  
    // Initialize session on component mount
    initializeSession();
  
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('fullname')
            .eq('id', session.user.id)
            .single();
  
          if (profileError && profileError.code !== 'PGRST116') throw profileError;
  
          useAuth.setState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              fullName: profileData?.fullname || null,
            },
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          useAuth.setState({ user: null });
        }
      } else {
        useAuth.setState({ user: null });
      }
    });
  
    // Unsubscribe from auth state changes when the component unmounts
    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);
  
  return <>{children}</>;
}
