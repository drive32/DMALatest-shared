import React, { createContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
}

export const AuthContext = createContext<{
  user: User | null;
}>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = await getSupabaseClient();
        // Listen to auth state changes
        const { data: subscription } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log(`Auth event: ${event}`);
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email,
              });
              AsyncStorage.setItem('supabase-session', JSON.stringify(session));
            } else {

              setUser(null);
              AsyncStorage.removeItem('supabase-session');
            }
          }
        );

        // Check if a session exists in AsyncStorage
        const storedSession = await AsyncStorage.getItem('supabase-session');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          await supabase.auth.setSession(parsedSession);
          if (parsedSession.user) {
            setUser(parsedSession.user);
          }
        }

        setLoading(false);

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
