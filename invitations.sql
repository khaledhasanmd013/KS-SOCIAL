
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  used_at timestamptz,
  revoked boolean not null default false
);

alter table public.invitations enable row level security;

create policy "Admins can manage invitations"
on public.invitations
for all
to authenticated
using (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
