import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Absolute path to apps/frontend (this file’s directory). */
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)))

function envLooksEnabled(v: string | undefined): boolean {
  const s = (v ?? '').trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes'
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, appRoot, 'VITE_')

  if (command === 'build') {
    console.info(
      `[exec-dashboard vite] mode=${mode} appRoot=${appRoot} VITE_USE_SUPABASE=${JSON.stringify(env.VITE_USE_SUPABASE)}`,
    )
    if (envLooksEnabled(env.VITE_USE_SUPABASE)) {
      const url = env.VITE_SUPABASE_URL?.trim()
      const key = env.VITE_SUPABASE_ANON_KEY?.trim()
      if (!url || !key) {
        throw new Error(
          'Production build: Supabase is enabled but VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing. ' +
            'Set them in apps/frontend/.env.production.local (next to vite.config.ts) or CI env before npm run build.',
        )
      }
    }
  }

  const buildEnvDefine =
    command === 'build'
      ? ({
          'import.meta.env.VITE_USE_SUPABASE': JSON.stringify(env.VITE_USE_SUPABASE ?? ''),
          'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL ?? ''),
          'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY ?? ''),
        } as Record<string, string>)
      : {}

  return {
    root: appRoot,
    envDir: appRoot,
    define: buildEnvDefine,
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      exclude: [],
    },
  }
})
