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
- **Docker** (for Supabase local only)
- **Supabase CLI** — `brew install supabase/tap/supabase`

## Install

```bash
npm install
```

---

## Runtime config: local vs remote (Vite)

The app reads **`VITE_SUPABASE_URL`**, **`VITE_SUPABASE_ANON_KEY`**, and **`VITE_USE_SUPABASE`** at **build time** (and when the dev server starts). Use **mode-specific** files so `npm run dev` hits local Supabase and `npm run build` / `preview` can target your hosted project without hand-editing env each time.

| File | When it applies |
|------|-----------------|
| [apps/frontend/.env.development.example](apps/frontend/.env.development.example) | Template for **`npm run dev`** — copy to **`.env.development.local`** |
| [apps/frontend/.env.production.example](apps/frontend/.env.production.example) | Template for **`npm run build`** / **`preview`** — copy to **`.env.production.local`** |
| [apps/frontend/.env.example](apps/frontend/.env.example) | Generic template; copy to **`.env.local`** if you want one file for quick experiments |

**Precedence (per [Vite env and mode](https://vitejs.dev/guide/env-and-mode.html)):** for `development`, later files override earlier — e.g. `.env.development.local` wins over `.env.local`. For `production` builds, **`.env.production.local` overrides `.env.local`**, so put hosted Supabase secrets in `.env.production.local` when you also keep a `.env.local` for local dev.

### Connect to **local** Supabase (development)

1. Start Docker, then from the **repo root**:

   ```bash
   supabase start
   supabase db reset
   ```

   `db reset` applies everything under `supabase/migrations/` to a fresh local database (use whenever you pull new migrations).

2. Copy keys from the CLI:

   ```bash
   supabase status
   ```

3. Configure the dev app:

   ```bash
   cp apps/frontend/.env.development.example apps/frontend/.env.development.local
   ```

   Edit `.env.development.local`: set **`VITE_SUPABASE_URL`** to the **API URL** (usually `http://127.0.0.1:54321`) and **`VITE_SUPABASE_ANON_KEY`** to the **anon** key from `supabase status`. Set **`VITE_USE_SUPABASE=true`**.

4. Run the app:

   ```bash
   npm run dev
   ```

   Open **Supabase Studio** at `http://localhost:54323` while the local stack is running.

### Connect to **remote** Supabase (hosted project)

1. **Create a project** in the [Supabase Dashboard](https://supabase.com/dashboard) (note the **project ref** in the default URL: `https://<project-ref>.supabase.co`).

2. **Link this repo** to that project (CLI must be logged in):

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   ```

3. **Push the same schema** your app expects (from `supabase/migrations/`):

   ```bash
   supabase db push
   ```

   Resolve any prompts about remote changes. After a successful push, the hosted DB matches your migration files.

4. **Get browser-safe keys** from the dashboard: **Project Settings → API**

   - **Project URL** → `VITE_SUPABASE_URL` (e.g. `https://abcdefgh.supabase.co`)
   - **anon public** → `VITE_SUPABASE_ANON_KEY` (never commit the **service_role** key to the frontend)

5. **Production-mode env** (used by `npm run build` and `npm run preview`):

   ```bash
   cp apps/frontend/.env.production.example apps/frontend/.env.production.local
   ```

   Fill in the **Project URL** and **anon public** key from the dashboard. Set **`VITE_USE_SUPABASE=true`**.

6. Build / preview against hosted Supabase:

   ```bash
   npm run build
   npm run preview
   ```

7. **Row Level Security:** new tables may have no RLS policies yet. Before exposing the hosted project to real users, add RLS policies (or restrict writes to trusted backends). Until then, treat the anon key exposure as a security review item.

---

## Supabase CLI quick reference

| Command | What it does |
|---------|----------------|
| `supabase start` | Start local stack (Postgres, API, Studio, …) |
| `supabase stop` | Stop local stack (data stays in Docker volumes) |
| `supabase db reset` | Recreate local DB from migrations (+ seed if configured) |
| `supabase status` | Print local API URL, anon key, **service_role** (for scripts only) |
| `supabase login` | Authenticate CLI for linking / remote commands |
| `supabase link --project-ref <ref>` | Associate repo with a hosted project |
| `supabase db push` | Apply local migrations to the **linked** remote database |

---

## Data migration (localStorage → JSON → Postgres)

1. Run the app **without** Supabase (`VITE_USE_SUPABASE=false` or unset) if you still have data only in the browser.
2. Use **Export Data** in the nav → `localstore-dump.json`.
3. Seed **local** or **remote** (service role bypasses RLS — keep this file secret):

   ```bash
   cp .env.seed.example .env.seed
   # Edit .env.seed: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
   # Local: keys from `supabase status`. Remote: Dashboard → Settings → API.
   npm run seed:from-dump -- ./localstore-dump.json
   ```

   The seed script auto-loads **repo-root `.env.seed`** if it exists (gitignored). You can still `export` variables in the shell instead.

---

## LocalStorage fallback

Set **`VITE_USE_SUPABASE=false`** (or leave Supabase URL/key empty and use local-only flow) to use **localStorage** only — no Docker or hosted project required.

---

## Build and lint

```bash
npm run build
npm run lint
```
