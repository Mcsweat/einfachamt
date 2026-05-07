create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text not null,
  status text not null default 'uploaded',
  extracted_text text,
  created_at timestamp with time zone not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "Users can insert their own documents" on public.documents;
create policy "Users can insert their own documents"
on public.documents for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can read their own documents" on public.documents;
create policy "Users can read their own documents"
on public.documents for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can update their own documents" on public.documents;
create policy "Users can update their own documents"
on public.documents for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  summary text not null,
  authority_request text not null,
  deadlines jsonb not null default '[]'::jsonb,
  todos jsonb not null default '[]'::jsonb,
  risks text not null,
  language text not null default 'de',
  created_at timestamp with time zone not null default now()
);

alter table public.analyses enable row level security;

drop policy if exists "Users can read analyses for their documents" on public.analyses;
create policy "Users can read analyses for their documents"
on public.analyses for select
to authenticated
using (
  exists (
    select 1
    from public.documents
    where documents.id = analyses.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "Users can create analyses for their documents" on public.analyses;
create policy "Users can create analyses for their documents"
on public.analyses for insert
to authenticated
with check (
  exists (
    select 1
    from public.documents
    where documents.id = analyses.document_id
      and documents.user_id = auth.uid()
  )
);

create table if not exists public.response_drafts (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  response_type text not null,
  draft_text text not null,
  created_at timestamp with time zone not null default now()
);

alter table public.response_drafts enable row level security;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text not null default 'none',
  plan text not null default 'free',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can read drafts for their analyses" on public.response_drafts;
create policy "Users can read drafts for their analyses"
on public.response_drafts for select
to authenticated
using (
  exists (
    select 1
    from public.analyses
    join public.documents on documents.id = analyses.document_id
    where analyses.id = response_drafts.analysis_id
      and documents.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload their own document files" on storage.objects;
create policy "Users can upload their own document files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can read their own document files" on storage.objects;
create policy "Users can read their own document files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
