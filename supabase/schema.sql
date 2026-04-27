create table if not exists public.profiles (
  id text primary key,
  display_name text not null,
  age integer not null default 24,
  location text not null default '',
  distance text not null default '',
  mbti text not null default '',
  profession text not null default '',
  bio text not null default '',
  tags jsonb not null default '[]'::jsonb,
  compatibility integer not null default 75 check (compatibility >= 0 and compatibility <= 100),
  avatar_gradient_from text not null default '#ff8fbc',
  avatar_gradient_to text not null default '#a970ff',
  face_tone text not null default '#ffe0d0',
  hair_color text not null default '#3a1f1a',
  photo_url text,
  chat_preview text not null default '',
  chat_time text not null default '',
  unread_count integer not null default 0,
  online boolean not null default false,
  verified boolean not null default false,
  compatible_tags jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_personas (
  id text primary key,
  profile_id text references public.profiles(id) on delete set null,
  display_name text not null,
  age integer,
  subtitle text not null default '',
  avatar text not null default '💬',
  bio text not null default '',
  photo_url text,
  opening_messages jsonb not null default '[]'::jsonb,
  fallback_replies jsonb not null default '[]'::jsonb,
  compatible_tags jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_scripts (
  id text primary key,
  persona_id text not null references public.chat_personas(id) on delete cascade,
  keywords jsonb not null default '[]'::jsonb,
  emotions jsonb not null default '[]'::jsonb,
  turn_range_start integer,
  turn_range_end integer,
  replies jsonb not null default '[]'::jsonb,
  once boolean not null default false,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_status_sort_idx
  on public.profiles(status, sort_order, created_at);

create index if not exists chat_personas_status_sort_idx
  on public.chat_personas(status, sort_order, created_at);

create index if not exists chat_scripts_persona_sort_idx
  on public.chat_scripts(persona_id, enabled, sort_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists chat_personas_set_updated_at on public.chat_personas;
create trigger chat_personas_set_updated_at
before update on public.chat_personas
for each row execute function public.set_updated_at();

drop trigger if exists chat_scripts_set_updated_at on public.chat_scripts;
create trigger chat_scripts_set_updated_at
before update on public.chat_scripts
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.chat_personas enable row level security;
alter table public.chat_scripts enable row level security;

drop policy if exists "profiles public read published" on public.profiles;
create policy "profiles public read published"
on public.profiles for select
using (status = 'published');

drop policy if exists "personas public read published" on public.chat_personas;
create policy "personas public read published"
on public.chat_personas for select
using (status = 'published');

drop policy if exists "scripts public read enabled published persona" on public.chat_scripts;
create policy "scripts public read enabled published persona"
on public.chat_scripts for select
using (
  enabled = true and exists (
    select 1 from public.chat_personas
    where chat_personas.id = chat_scripts.persona_id
      and chat_personas.status = 'published'
  )
);

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update set public = excluded.public;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'MatchU 用户',
  avatar_url text,
  age integer,
  city text not null default '',
  profession text not null default '',
  mbti text not null default '',
  bio text not null default '',
  verified boolean not null default false,
  likes_received integer not null default 0,
  matches_count integer not null default 0,
  highest_compatibility integer not null default 75,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null default '',
  content text not null,
  image_urls jsonb not null default '[]'::jsonb,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists community_posts_status_created_idx
  on public.community_posts(status, created_at desc);

create index if not exists community_posts_user_idx
  on public.community_posts(user_id, created_at desc);

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists community_posts_set_updated_at on public.community_posts;
create trigger community_posts_set_updated_at
before update on public.community_posts
for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_likes enable row level security;

drop policy if exists "user profiles public read" on public.user_profiles;
create policy "user profiles public read"
on public.user_profiles for select
using (true);

drop policy if exists "users update own profile" on public.user_profiles;
create policy "users update own profile"
on public.user_profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "users insert own profile" on public.user_profiles;
create policy "users insert own profile"
on public.user_profiles for insert
with check (auth.uid() = id);

drop policy if exists "posts public read published" on public.community_posts;
create policy "posts public read published"
on public.community_posts for select
using (status = 'published');

drop policy if exists "users insert own posts" on public.community_posts;
create policy "users insert own posts"
on public.community_posts for insert
with check (auth.uid() = user_id);

drop policy if exists "users update own posts" on public.community_posts;
create policy "users update own posts"
on public.community_posts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users read own likes" on public.post_likes;
create policy "users read own likes"
on public.post_likes for select
using (auth.uid() = user_id);

drop policy if exists "users insert own likes" on public.post_likes;
create policy "users insert own likes"
on public.post_likes for insert
with check (auth.uid() = user_id);

drop policy if exists "users delete own likes" on public.post_likes;
create policy "users delete own likes"
on public.post_likes for delete
using (auth.uid() = user_id);
