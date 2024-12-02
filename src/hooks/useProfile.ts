import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface Profile {
  id: string;
  fullName: string | null;
  gender: 'male' | 'female' | 'other' | null;
  country: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  bio: string | null;
  avatar: string | null;
}

interface ProfileStore {
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>, avatarFile?: File | null) => Promise<void>;
}

export const useProfile = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        set({
          profile: {
            id: data.id,
            fullName: data.fullname,
            gender: data.gender,
            country: data.country,
            dateOfBirth: data.dob,
            phoneNumber: data.phone_number,
            address: data.address,
            bio: data.bio,
            avatar: data.avatar
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ error: 'Failed to fetch profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userId: string, updates: Partial<Profile>, avatarFile?: File | null) => {
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
        if (avatarFile.size > 5 * 1024 * 1024) {
          throw new Error('Avatar file size must be less than 5MB');
        }
        
        try {
          const fileExt = avatarFile.name.split('.').pop();
          const filePath = `${userId}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, {
              upsert: true
            });
          
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          
          avatarUrl = publicUrl;
        } catch (error) {
          console.error('Avatar upload error:', error);
          throw new Error('Failed to upload avatar');
        }
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

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase 
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select('*');

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }

      toast.success('Profile updated successfully');

      set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          fullName: data[0].fullname || null,
          gender: data[0].gender || null,
          country: data[0].country || null,
          dateOfBirth: data[0].dob || null,
          phoneNumber: data[0].phone_number || null,
          address: data[0].address || null,
          bio: data[0].bio || null,
          ...updates,
          avatar: avatarUrl ?? state.profile.avatar
        } : {
          id: userId,
          fullName: data[0].fullname || null,
          gender: data[0].gender || null,
          country: data[0].country || null,
          dateOfBirth: data[0].dob || null,
          phoneNumber: data[0].phone_number || null,
          address: data[0].address || null,
          bio: data[0].bio || null,
          avatar: avatarUrl
        }
      }));

    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Update timed out. Please try again.');
      } else {
        toast.error(error.message || 'Failed to update profile');
        set({ error: error.message || 'Failed to update profile' });
      }
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