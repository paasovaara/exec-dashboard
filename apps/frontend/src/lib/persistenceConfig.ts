function envLooksEnabled(v: unknown): boolean {
  const s = String(v ?? '')
    .trim()
    .toLowerCase()
  return s === 'true' || s === '1' || s === 'yes'
}

/** Vite inlines at build time; accepts true / 1 / yes (trimmed, case-insensitive). */
export const useSupabasePersistence = envLooksEnabled(import.meta.env.VITE_USE_SUPABASE)

/** Project URL baked in at build time (empty if not set). */
export const bundledSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';

const url = bundledSupabaseUrl;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const supabaseClientConfigured = Boolean(url && anon);

/** Build asked for Supabase but URL/key were missing at build time. */
export const isSupabaseMisconfigured = useSupabasePersistence && !supabaseClientConfigured;
