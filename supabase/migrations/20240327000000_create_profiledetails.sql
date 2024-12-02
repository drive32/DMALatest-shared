-- Create ProfileDetails table
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  fullname text default '',
  gender text check (gender in ('male', 'female', 'other')),
  country text,
  dob date,
  phone_number text,
  address text,
  bio text,
  avatar text
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view their own profile details"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile details"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile details"
  on public.profiles for update
  using (auth.uid() = id);

-- Create function to handle profile updates
create or replace function handle_profile_update()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updating updated_at timestamp
create trigger on_profile_update
  before update on public.profiles
  for each row
  execute procedure handle_profile_update();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;