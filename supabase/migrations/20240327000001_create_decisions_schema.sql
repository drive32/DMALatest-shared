-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Decisions table
create table if not exists public.decisions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('pending', 'decided', 'completed')) default 'pending',
  category text,
  image_url text,
  deadline timestamp with time zone,
  is_private boolean default false,
  is_featured boolean default false,
  view_count integer default 0,
  ai_recommendation text,
  final_decision text,
  outcome text
);

-- Decision votes table
create table if not exists public.decision_votes (
  id uuid primary key default uuid_generate_v4(),
  decision_id uuid references public.decisions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  vote_type text check (vote_type in ('up', 'down')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(decision_id, user_id)
);

-- Decision comments table
create table if not exists public.decision_comments (
  id uuid primary key default uuid_generate_v4(),
  decision_id uuid references public.decisions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  parent_id uuid references public.decision_comments(id) on delete cascade,
  is_edited boolean default false
);

-- Decision tags table
create table if not exists public.decision_tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

-- Decision tags mapping table
create table if not exists public.decision_tag_mappings (
  decision_id uuid references public.decisions(id) on delete cascade not null,
  tag_id uuid references public.decision_tags(id) on delete cascade not null,
  primary key (decision_id, tag_id)
);

-- Decision collaborators table
create table if not exists public.decision_collaborators (
  decision_id uuid references public.decisions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('viewer', 'contributor', 'admin')) default 'viewer',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (decision_id, user_id)
);

-- Create indexes for better query performance
create index if not exists decisions_user_id_idx on public.decisions(user_id);
create index if not exists decisions_created_at_idx on public.decisions(created_at);
create index if not exists decisions_status_idx on public.decisions(status);
create index if not exists decision_votes_decision_id_idx on public.decision_votes(decision_id);
create index if not exists decision_comments_decision_id_idx on public.decision_comments(decision_id);
create index if not exists decision_tags_name_idx on public.decision_tags(name);

-- Set up Row Level Security (RLS)
alter table public.decisions enable row level security;
alter table public.decision_votes enable row level security;
alter table public.decision_comments enable row level security;
alter table public.decision_tags enable row level security;
alter table public.decision_tag_mappings enable row level security;
alter table public.decision_collaborators enable row level security;

-- Create policies
-- Decisions policies
create policy "Enable read access for all users"
  on public.decisions 
  for select
  using (true);

create policy "Enable insert for authenticated users only"
  on public.decisions 
  for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own decisions"
  on public.decisions 
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own decisions"
  on public.decisions 
  for delete
  using (auth.uid() = user_id);

-- Votes policies
create policy "Users can view all votes"
  on public.decision_votes for select
  using (true);

create policy "Users can vote once per decision"
  on public.decision_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can change their own votes"
  on public.decision_votes for update
  using (auth.uid() = user_id);

-- Comments policies
create policy "Users can view comments on accessible decisions"
  on public.decision_comments for select
  using (exists (
    select 1 from public.decisions d
    where d.id = decision_id
    and (not d.is_private or d.user_id = auth.uid())
  ));

create policy "Users can create comments"
  on public.decision_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.decision_comments for update
  using (auth.uid() = user_id);

-- Create functions for common operations
create or replace function increment_view_count(decision_id uuid)
returns void as $$
begin
  update public.decisions
  set view_count = view_count + 1
  where id = decision_id;
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;