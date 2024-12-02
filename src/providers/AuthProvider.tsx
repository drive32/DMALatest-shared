import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const ACTIVITY_TIMEOUT = 1800000; // 30 minutes

  useEffect(() => {
    const handleActivity = () => {
      useAuth.getState().refreshSession();
    };

    // Set up activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Set up session check interval
    const sessionCheckInterval = setInterval(() => {
      useAuth.getState().checkSession();
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(sessionCheckInterval);
    };
  }, []);

  useEffect(() => {
    // Check current session and refresh if needed
    const refreshSession = async () => {
      const handleSessionClear = () => {
        useAuth.setState({ 
          user: null,
          sessionTimeout: null,
          lastActivity: null 
        });
      };

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          handleSessionClear();
          throw error;
        }

        if (session) {
          // Refresh the session
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError || !refreshedSession) {
            console.error('Session refresh error:', refreshError);
            handleSessionClear();
            throw new Error('Failed to refresh session');
          }

          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('fullname')
            .eq('id', refreshedSession.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
            return;
          }

          useAuth.setState({
            user: {
              id: refreshedSession.user.id,
              email: refreshedSession.user.email || '',
              fullName: profileData?.fullname || null
            },
            sessionTimeout: 3600000, // 1 hour
            lastActivity: Date.now()
          });
        }
      } catch (error) {
        console.error('Session refresh error:', error);
        handleSessionClear();
      }
    };

    refreshSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          // Get user profile data
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
              fullName: profileData?.fullname || null
            }
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          await supabase.auth.signOut();
          useAuth.setState({ user: null });
        }
      } else {
        useAuth.setState({ user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}