import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { UserCircle, AlertCircle } from 'lucide-react';
import { Sidebar } from '../components/decision/Sidebar';
import { ProfileForm } from '../components/profile/ProfileForm';
import { getSupabaseClient } from '../lib/supabase';

export function Profile() {
  const { user,refreshSession,setUser } = useAuth();
  const { profile, isLoading, error, fetchProfile } = useProfile();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
      const handleUserChange = async () => {
      

        if (user) {
    
        // Await asynchronous functions here
          await fetchProfile(user.id);
        } else{
          const { user } = await refreshSession(); // Destructure 'user' from the result
          setUser(user);
          if (user) {
            await fetchProfile(user.id);
          }
          
        }
      };
    
      handleUserChange();
    }, [user,refreshSession]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-accent-50/5 to-accent-100/10">
      <Sidebar />
      
      <main className="ml-64 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50/10 via-transparent to-accent-100/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-100/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-50/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-accent-100 relative overflow-hidden"
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-50/5 via-transparent to-accent-100/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-100/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-accent-50">
                <UserCircle className="w-8 h-8 text-accent-600" style={{color:'#9333ea'}} />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-primary">
                  Profile Settings
                </h1>
                <p className="text-gray-600">
                  Manage your personal information and preferences
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {profile ? (
              <ProfileForm
                userId={userId || user.id}
                initialData={{
                  fullName: profile.fullName || '',
                  gender: profile.gender || '',
                  country: profile.country || '',
                  dateOfBirth: profile.dateOfBirth || '',
                  phoneNumber: profile.phoneNumber || '',
                  address: profile.address || '',
                  bio: profile.bio || '',
                  avatar: profile.avatar || '',
                }}
              />
            ) : (
              <div>Loading...</div> // Optionally render a loading state
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}