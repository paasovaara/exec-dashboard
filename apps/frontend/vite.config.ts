import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), '')
    if (env.VITE_USE_SUPABASE === 'true') {
      const url = env.VITE_SUPABASE_URL?.trim()
      const key = env.VITE_SUPABASE_ANON_KEY?.trim()
      if (!url || !key) {
        throw new Error(
          'Production build: VITE_USE_SUPABASE=true but VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing. ' +
            'Set them in apps/frontend/.env.production.local or CI env before npm run build.',
        )
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      exclude: [],
    },
  }
})
