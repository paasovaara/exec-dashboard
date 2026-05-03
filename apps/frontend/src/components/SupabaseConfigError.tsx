export const SupabaseConfigError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-lg rounded-xl border border-amber-500/40 bg-amber-950/30 p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-amber-100 mb-2">Supabase is enabled but not configured</h1>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          <code className="text-amber-200/90">VITE_USE_SUPABASE=true</code> was set at build time, but{' '}
          <code className="text-amber-200/90">VITE_SUPABASE_URL</code> or{' '}
          <code className="text-amber-200/90">VITE_SUPABASE_ANON_KEY</code> was missing. Those values are
          baked into the bundle when you run <code className="text-zinc-400">npm run build</code>, not read
          from the server at runtime.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Add <code className="text-zinc-300">apps/frontend/.env.production.local</code> (or your CI
          environment) with all three variables, then rebuild and redeploy.
        </p>
      </div>
    </div>
  );
};
