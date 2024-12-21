import { create } from 'zustand';
import { getSupabaseClient } from '../lib/supabase';
import { toast } from 'sonner';
import { Decision } from '../types';
import { uploadFile } from '../utils/api';
import { STORAGE_BUCKETS } from '../utils/constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


interface DecisionsStore {
  decisions: Decision[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  communityDecisions: Decision[];
  DesicionData:Decision[];
  fetchCommunityDecisions: () => Promise<void>;
  fetchDecisionById: (id:any) => Promise<void>;
  fetchDecisionCountByGender: (id:any) => Promise<{ male: { up: number; down: number }; female: { up: number; down: number } }>;

  fetchDecisions: () => Promise<void>;
  loadMoreDecisions: () => Promise<void>;
  createDecision: (data: {
    id?: string;
    title: string;
    description: string;
    category?: string;
    image?: File;
    user_id: string;
    created_at: string;
    image_url: string | null;
    decision_expired: string | null;
  }) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;
  voteDecision: (decisionId: string, voteType: 'up' | 'down') => Promise<void>;
  addComment: (decisionId: string, comment: string) => Promise<void>;
}

export const useDecisions = create<DecisionsStore>((set, get) => ({
  decisions: [],
  communityDecisions: [],
  DesicionData: [],
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
  fetchDecisionCountByGender: async (id: any): Promise<{ male: { up: number; down: number }; female: { up: number; down: number } }> => {
    const supabase = await getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('decision_votes')
        .select(`
          vote_type,
          profiles:profiles!inner (
            gender
          )
        `)
        .eq('decision_id', id);
  
      if (error) throw new Error(`Error fetching decision votes: ${error.message}`);
  
      // Aggregate the results
      const result = data?.reduce(
        (acc, { vote_type, profiles }) => {
          if (profiles?.gender === 'male') {
            if (vote_type === 'up') acc.male.up++;
            if (vote_type === 'down') acc.male.down++;
          } else if (profiles?.gender === 'female') {
            if (vote_type === 'up') acc.female.up++;
            if (vote_type === 'down') acc.female.down++;
          }
          return acc;
        },
        {
          male: { up: 0, down: 0 },
          female: { up: 0, down: 0 },
        }
      );
  
      console.log('Gender vote counts:', result);
  
      return result;
    } catch (err) {
      console.error('Error fetching gender vote counts:', err);
      throw new Error(err.message || 'Failed to fetch gender vote counts');
    }
        
  },
  
  fetchDecisionById: async (id:any): Promise<void> => {
    set({ isLoading: true, error: null });
    const supabase = await getSupabaseClient();

    try {
      // First get all decisions with related data
      const { data, error } = await supabase
        .from('decisions')
        .select(`
          *,
          profiles:profiles!user_id (
            fullname,
            email,
            avatar
          ),
          votes:decision_votes!left (
            vote_type,
            user_id
          ),
          comments:decision_comments (id)
        `)
        .eq('id', id); // Add this to filter by the specific id

      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Process and transform the data
      const decisionsWithVotes = (data || []).map(d => ({
        ...d,
        votes: {
          up: d.votes?.filter(v => v.vote_type === 'up')?.length || 0,
          down: d.votes?.filter(v => v.vote_type === 'down')?.length || 0,
          userVote: user ? d.votes?.find(v => v.user_id === user.id)?.vote_type || null : null,
        },
        comments: d.comments || [],
        profiles: {
          fullname: d.profiles?.fullname || null,
          email: d.profiles?.email || null,
          avatar: d.profiles?.avatar || null

        }
      }));
      
      set({ DesicionData: decisionsWithVotes });
    } catch (error) {
      console.error('Error fetching community decisions:', error);
      set({ error: 'Failed to fetch community decisions' });
      toast.error('Unable to load community decisions. Please try again later.');
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCommunityDecisions: async (): Promise<void> => {
    set({ isLoading: true, error: null });
    const supabase = await getSupabaseClient();

    try {
      // First get all decisions with related data
      const { data, error } = await supabase
        .from('decisions')
        .select(`
          *,
          profiles:profiles!user_id (
            fullname,
            email,
            avatar
          ),
          votes:decision_votes!left (
            vote_type,
            user_id
          ),
          comments:decision_comments (id)
        `)
        .range(0, 19)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Process and transform the data
      const decisionsWithVotes = (data || []).map(d => ({
        ...d,
        votes: {
          up: d.votes?.filter(v => v.vote_type === 'up')?.length || 0,
          down: d.votes?.filter(v => v.vote_type === 'down')?.length || 0,
          userVote: user ? d.votes?.find(v => v.user_id === user.id)?.vote_type || null : null,
        },
        comments: d.comments || [],
        profiles: {
          fullname: d.profiles?.fullname || null,
          email: d.profiles?.email || null,
          avatar: d.profiles?.avatar || null
        }
      }));
      
      set({ communityDecisions: decisionsWithVotes });
    } catch (error) {
      console.error('Error fetching community decisions:', error);
      set({ error: 'Failed to fetch community decisions' });
      toast.error('Unable to load community decisions. Please try again later.');
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDecisions: async () => {
    set({ isLoading: true, error: null });
    const supabase = await getSupabaseClient();

    try {

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Authentication required');

      // Fetch decisions with related data
      const { data, error } = await supabase
        .from('decisions')
        .select(`
          *,
          profiles:profiles!user_id (
            fullname,
            email,
            avatar
          ),
          votes:decision_votes!left (
            vote_type,
            user_id
          ),
          comments:decision_comments!left (id)
        `)
        .eq('user_id', session.user.id)
        .range(0, 19)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const decisionsWithVotes = (data || []).map(d => ({
        ...d,
        votes: {
          up: d.votes?.filter(v => v.vote_type === 'up')?.length || 0,
          down: d.votes?.filter(v => v.vote_type === 'down')?.length || 0,
          userVote: d.votes?.find(v => v.user_id === session.user.id)?.vote_type || null
        },
        comments: d.comments || [],
        profiles: {
          fullname: d.profiles?.fullname || null,
          email: d.profiles?.email || null,
          avatar: d.profiles?.avatar || null

        }
      }));
      
      set({ 
        decisions: decisionsWithVotes,
        hasMore: data?.length === 20
      });
    } catch (error) {
      console.error('Error fetching decisions:', error);
      set({ error: 'Failed to fetch decisions' });
      toast.error('Failed to fetch decisions');
    } finally {
      set({ isLoading: false });
    }
  },

  loadMoreDecisions: async () => {
    const supabase = await getSupabaseClient();

    const { isLoading, hasMore, page, decisions } = get();
    if (isLoading || !hasMore) return;

    set({ isLoading: true });
    try {
      const from = page * 20;
      const to = from + 19;

      const { data, error } = await supabase
        .from('decisions')
        .select(`
          *,
          profiles:user_id (fullname, email),
          votes:decision_votes (vote_type)
        `)
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const newDecisions = data?.map(d => ({
        ...d,
        votes: {
          up: d.votes?.filter(v => v.vote_type === 'up').length || 0,
          down: d.votes?.filter(v => v.vote_type === 'down').length || 0
        }
      })) || [];

      set({
        decisions: [...decisions, ...newDecisions],
        page: page + 1,
        hasMore: data?.length === 20
      });
    } catch (error) {
      console.error('Error fetching decisions:', error);
      set({ error: 'Failed to fetch decisions' });
      toast.error('Failed to fetch decisions');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDecision: async (id: string) => {
    const supabase = await getSupabaseClient();

    try {
      const { error } = await supabase
        .from('decisions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        decisions: state.decisions.filter(d => d.id !== id)
      }));

      toast.success('Decision deleted successfully!');
    } catch (error) {
      console.error('Error deleting decision:', error);
      toast.error('Failed to delete decision');
      throw error;
    }
  },

  createDecision: async ({ title, description, category, image,decision_expired }) => {
    const supabase = await getSupabaseClient();
    const { fetchCommunityDecisions } = get();

    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const imageUrl = image ? await uploadFile(STORAGE_BUCKETS.DECISIONS, image) : null;

      const { data, error } = await supabase
        .from('decisions')
        .insert({
          title,
          description,
          category,
          user_id: user.id,
          image_url: imageUrl,
          status: 'pending',
          decision_expired,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCommunityDecisions();

      toast.success('Decision posted successfully!');
    } catch (error) {
      console.error('Error creating decision:', error);
      set({ error: 'Failed to create decision' });
      toast.error('Failed to create decision');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },


  voteDecision: async (decisionId: string, voteType: 'up' | 'down') => {
    const supabase = await getSupabaseClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to vote');

      // Check for existing vote
      const { data: existingVote } = await supabase
        .from('decision_votes')
        .select('*')
        .eq('decision_id', decisionId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same type
          await supabase
            .from('decision_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote type if different
          await supabase
            .from('decision_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('decision_votes')
          .insert({
            decision_id: decisionId,
            user_id: user.id,
            vote_type: voteType
          });
      }

      // Optimistically update UI
      set(state => ({
        communityDecisions: state.communityDecisions.map(d => {
          if (d.id === decisionId) {
            const votes = { ...d.votes };
            if (existingVote) {
              if (existingVote.vote_type === voteType) {
                votes[voteType]--;
              } else {
                votes[existingVote.vote_type]--;
                votes[voteType]++;
              }
            } else {
              votes[voteType]++;
            }
            return { ...d, votes };
          }
          return d;
        })
      }));

      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      if (error instanceof Error && error.message === 'Must be logged in to vote') {
        toast.error('Please sign in to vote');
      } else {
        toast.error('Failed to record vote');
      }
    }
  },

  addComment: async (decisionId: string, comment: string) => {
    const supabase = await getSupabaseClient();

    try {
      const { error } = await supabase
        .from('decision_comments')
        .insert({
          decision_id: decisionId,
          comment
        });

      if (error) throw error;
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  }
}));