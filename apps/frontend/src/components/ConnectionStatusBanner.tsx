import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { bundledSupabaseUrl, useSupabasePersistence } from '../lib/persistenceConfig';

type CheckState = 'idle' | 'checking' | 'ok' | 'error';

export const ConnectionStatusBanner = () => {
  const [state, setState] = useState<CheckState>(useSupabasePersistence ? 'checking' : 'idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabasePersistence) {
      setState('idle');
      setMessage(null);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setState('checking');
      setMessage(null);
      const { error } = await supabase.from('tasks').select('id').limit(1);
      if (cancelled) return;
      if (error) {
        setState('error');
        setMessage(error.message);
      } else {
        setState('ok');
        setMessage(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!useSupabasePersistence) {
    return (
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-zinc-700/80 bg-zinc-950/95 text-[11px] sm:text-xs text-zinc-400"
        aria-live="polite"
      >
        <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-zinc-500" aria-hidden />
        <span className="truncate">
          No Supabase API — data stays in this browser. Enable{' '}
          <code className="text-zinc-500">VITE_USE_SUPABASE=true</code> at build time to use a project URL.
        </span>
      </div>
    );
  }

  const displayUrl = bundledSupabaseUrl || '(URL missing)';

  return (
    <div
      className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-zinc-700/80 bg-zinc-950/95 text-[11px] sm:text-xs text-zinc-300"
      aria-live="polite"
    >
      {state === 'checking' && (
        <>
          <span
            className="h-1.5 w-1.5 rounded-full shrink-0 bg-amber-400 animate-pulse"
            aria-hidden
          />
          <span className="truncate">
            Checking <span className="text-zinc-400 font-mono">{displayUrl}</span>…
          </span>
        </>
      )}
      {state === 'ok' && (
        <>
          <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-emerald-500" aria-hidden />
          <span className="truncate">
            Connected to <span className="text-zinc-100 font-mono">{displayUrl}</span>
          </span>
        </>
      )}
      {state === 'error' && (
        <>
          <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-red-500" aria-hidden />
          <span className="truncate">
            <span className="text-zinc-100 font-mono">{displayUrl}</span>
            <span className="text-red-300/90"> — {message ?? 'request failed'}</span>
          </span>
        </>
      )}
    </div>
  );
};
