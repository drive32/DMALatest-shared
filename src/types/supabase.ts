@@ .. @@
export interface Decision {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'decided' | 'completed';
  category: string | null;
  image_url: string | null;
  deadline: string | null;
  is_private: boolean;
  is_featured: boolean;
  view_count: number;
  ai_recommendation: string | null;
  final_decision: string | null;
  outcome: string | null;
}

 export interface Database {
   public: {
     Tables: {
+      decisions: {
+        Row: {
+          id: string;
+          user_id: string;
+          title: string;
+          description: string;
+          created_at: string;
+          updated_at: string;
+          status: 'pending' | 'decided' | 'completed';
+          category: string | null;
+          image_url: string | null;
+          deadline: string | null;
+          is_private: boolean;
+          is_featured: boolean;
+          view_count: number;
+          ai_recommendation: string | null;
+          final_decision: string | null;
+          outcome: string | null;
+        };
+        Insert: {
+          id?: string;
+          user_id: string;
+          title: string;
+          description: string;
+          created_at?: string;
+          updated_at?: string;
+          status?: 'pending' | 'decided' | 'completed';
+          category?: string | null;
+          image_url?: string | null;
+          deadline?: string | null;
+          is_private?: boolean;
+          is_featured?: boolean;
+          view_count?: number;
+          ai_recommendation?: string | null;
+          final_decision?: string | null;
+          outcome?: string | null;
+        };
+        Update: {
+          id?: string;
+          user_id?: string;
+          title?: string;
+          description?: string;
+          created_at?: string;
+          updated_at?: string;
+          status?: 'pending' | 'decided' | 'completed';
+          category?: string | null;
+          image_url?: string | null;
+          deadline?: string | null;
+          is_private?: boolean;
+          is_featured?: boolean;
+          view_count?: number;
+          ai_recommendation?: string | null;
+          final_decision?: string | null;
+          outcome?: string | null;
+        };
+      };
+      decision_votes: {
+        Row: {
+          id: string;
+          decision_id: string;
+          user_id: string;
+          vote_type: 'up' | 'down';
+          created_at: string;
+        };
+        Insert: {
+          id?: string;
+          decision_id: string;
+          user_id: string;
+          vote_type: 'up' | 'down';
+          created_at?: string;
+        };
+        Update: {
+          id?: string;
+          decision_id?: string;
+          user_id?: string;
+          vote_type?: 'up' | 'down';
+          created_at?: string;
+        };
+      };
+      decision_comments: {
+        Row: {
+          id: string;
+          decision_id: string;
+          user_id: string;
+          comment: string;
+          created_at: string;
+          updated_at: string;
+          parent_id: string | null;
+          is_edited: boolean;
+        };
+        Insert: {
+          id?: string;
+          decision_id: string;
+          user_id: string;
+          comment: string;
+          created_at?: string;
+          updated_at?: string;
+          parent_id?: string | null;
+          is_edited?: boolean;
+        };
+        Update: {
+          id?: string;
+          decision_id?: string;
+          user_id?: string;
+          comment?: string;
+          created_at?: string;
+          updated_at?: string;
+          parent_id?: string | null;
+          is_edited?: boolean;
+        };
+      };
       profiles: {
         Row: {
           id: string;
@@ .. @@