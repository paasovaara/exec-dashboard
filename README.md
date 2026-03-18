# Eisenhower Matrix Dashboard

A modern, mobile-responsive web application for task management using the Eisenhower Matrix methodology. Organize your tasks by urgency and importance across a 2x2 grid to prioritize effectively.

## Tech Stack

- **React 19** + **TypeScript** + **Vite** + **Tailwind CSS 4** — frontend
- **Supabase** (PostgreSQL + PostgREST) — backend / persistence
- **npm workspaces** — monorepo

## Project Structure

```
exec-dashboard/
├── apps/frontend/       # React app (Vite)
├── packages/shared/     # Shared types, Zod schemas, helpers
├── supabase/            # Supabase config + SQL migrations
├── scripts/             # Seed / migration scripts
└── package.json         # Workspace root
```

## Prerequisites

- **Node.js** >= 18
- **Docker** (for Supabase local)
- **Supabase CLI** — `brew install supabase/tap/supabase`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start Supabase locally

```bash
supabase start
```

This starts PostgreSQL, PostgREST, Auth, and Studio in Docker. Note the **API URL** and **anon key** printed by the command (also available via `supabase status`).

### 3. Configure the frontend

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Edit `apps/frontend/.env.local` with the values from `supabase status`:

```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<anon key from supabase status>
```

### 4. Run the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Supabase Management

| Command | What it does |
|---|---|
| `supabase start` | Start local Supabase stack |
| `supabase stop` | Stop local stack (data persists in Docker volumes) |
| `supabase db reset` | Drop and recreate DB from migrations + seed |
| `supabase status` | Show local URLs and keys |
| `supabase db push` | Push migrations to a linked remote project |

Studio is available at `http://localhost:54323` when the local stack is running.

## Data Migration (localStorage to Postgres)

If you have existing data in localStorage from the previous single-page version:

1. Open the app **without** Supabase (`VITE_USE_SUPABASE` unset or `false`)
2. Use the **Export Data** action to download `localstore-dump.json`
3. Seed the database:

```bash
npm run seed:from-dump -- ./localstore-dump.json
```

## LocalStorage Fallback

Set `VITE_USE_SUPABASE=false` (or leave it unset) to run the app with localStorage only — no backend required.

## Build for Production

```bash
npm run build
```

## Linting

```bash
npm run lint
```
