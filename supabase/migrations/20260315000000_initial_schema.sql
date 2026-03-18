-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- Tasks (Eisenhower matrix)
-- ============================================================
create table tasks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  urgency       boolean not null default false,
  importance    boolean not null default false,
  status        text not null default 'active'
                  check (status in ('active', 'done', 'deleted')),
  details       text,
  due_date      timestamptz,
  metadata      jsonb,
  linked_initiative_ids uuid[] default '{}',
  linked_program_ids    uuid[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- Activity events
-- ============================================================
create table activity_events (
  id            uuid primary key default gen_random_uuid(),
  type          text not null
                  check (type in ('task_added', 'task_done', 'task_deleted')),
  task_id       uuid not null,
  task_title    text not null,
  timestamp     timestamptz not null default now(),
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- Persons (DRIs / stakeholders)
-- ============================================================
create table persons (
  id            uuid primary key default gen_random_uuid(),
  firstname     text not null,
  lastname      text not null,
  title         text,
  avatar        text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- Initiatives
-- ============================================================
create table initiatives (
  id              uuid primary key default gen_random_uuid(),
  rag_status      text not null default 'green'
                    check (rag_status in ('red', 'amber', 'green')),
  title           text not null,
  priority        text not null default 'P2'
                    check (priority in ('P0', 'P1', 'P2')),
  target_date     text,
  dri_id          uuid references persons(id) on delete set null,
  needs_attention boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- Programs
-- ============================================================
create table programs (
  id              uuid primary key default gen_random_uuid(),
  rag_status      text not null default 'green'
                    check (rag_status in ('red', 'amber', 'green')),
  title           text not null,
  priority        text not null default 'P2'
                    check (priority in ('P0', 'P1', 'P2')),
  target_date     text,
  initiative_ids  uuid[] default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- Updated-at trigger
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

create trigger persons_updated_at
  before update on persons
  for each row execute function update_updated_at();

create trigger initiatives_updated_at
  before update on initiatives
  for each row execute function update_updated_at();

create trigger programs_updated_at
  before update on programs
  for each row execute function update_updated_at();
