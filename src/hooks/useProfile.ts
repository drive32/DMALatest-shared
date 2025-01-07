import { create } from 'zustand';
import { getSupabaseClient } from '../lib/supabase';
import { toast } from 'sonner';
import { uploadFile } from '../utils/api';
import { STORAGE_BUCKETS } from '../utils/constants';
import { format } from 'date-fns';


import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Profile {
  id: string;
  fullName: string | null;
  gender: 'male' | 'female' | 'other' | null;
  country: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  bio: string | null;
  avatar: string | '';
  createdAt:string | '';
}

interface ProfileStore {
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchProfile: (userId: any) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>, avatarFile?: File | null) => Promise<void>;
}

export const useProfile = create<ProfileStore>((set,get) => ({
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  fetchProfile: async (userId: any) => {
    set({ isLoading: true, error: null });
    const supabase = await getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {

        set((state) => ({
          ...state, // Ensure you spread the existing state
          profile: {
            id: data.id,
            fullName: data.fullname,
            gender: data.gender,
            country: data.country,
            dateOfBirth: data.dob,
            phoneNumber: data.phone_number,
            address: data.address,
            bio: data.bio,
            avatar: data.avatar,
            createdAt:format(new Date(data?.created_at), 'dd MMMM yyyy'),
            
          }
        }));

      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ error: 'Failed to fetch profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userId: string, updates: Partial<Profile>, avatarFile?: File | null) => {

    const sessionString = await AsyncStorage.getItem('supabase-session');

    if (!sessionString) throw new Error('Authentication required');
    
    const session = JSON.parse(sessionString);

    if (!userId) {
      toast.error('Invalid user');
      throw new Error('Invalid user ID');
    }

    set({ isUpdating: true, error: null });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      let avatarUrl = updates.avatar;
      
      if (avatarFile) { 
        avatarUrl = avatarFile ? await uploadFile(STORAGE_BUCKETS.AVATARS, avatarFile) : avatarUrl;
      }

      
      const profileData = {
        fullname: updates.fullName ?? null,
        gender: updates.gender ?? null,
        country: updates.country || null,
        dob: updates.dateOfBirth || null,
        phone_number: updates.phoneNumber || null,
        address: updates.address || null,
        bio: updates.bio || null,
        avatar: avatarUrl || null
      };
      console.log("Step 3 :"+JSON.stringify(profileData));
      // Get current session
     

      
      console.log("Starting profile update...");
      console.log("Session User ID:", session?.user?.id);

      const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${session?.user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        console.error('Error updating profile 2:', await response.json());
      } else {
        console.log('Profile updated successfully');
      }
    
      toast.success('Profile updated successfully');

      set((state) => ({
        profile: {
          id: userId,
          fullName: profileData.fullname || null,
          gender: profileData.gender || null,
          country: profileData.country || null,
          dateOfBirth: profileData.dob || null,
          phoneNumber: profileData.phone_number || null,
          address: profileData.address || null,
          bio: profileData.bio || null,
          avatar: avatarUrl || null
        }
      }));

    } catch (error : unknown) {

      let errorMessage = 'Failed to update profile';

      if (error instanceof Error) {
        errorMessage = error.message; // Extract message if error is an instance of Error
      } else if (typeof error === 'string') {
        errorMessage = error; // If the error is a string, use it directly
      }
      toast.error(errorMessage || 'Failed to update profile');
      set({ error: errorMessage || 'Failed to update profile' });

      throw error;
    } finally {
      clearTimeout(timeoutId);
      set({ 
        isUpdating: false,
        error: null 
      });
    }
  }
}));