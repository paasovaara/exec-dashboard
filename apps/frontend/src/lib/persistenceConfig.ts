/** String compare: Vite inlines env as strings; only `'true'` enables Supabase. */
export const useSupabasePersistence = import.meta.env.VITE_USE_SUPABASE === 'true';

/** Project URL baked in at build time (empty if not set). */
export const bundledSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';

const url = bundledSupabaseUrl;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const supabaseClientConfigured = Boolean(url && anon);

/** Build asked for Supabase but URL/key were missing at build time. */
export const isSupabaseMisconfigured = useSupabasePersistence && !supabaseClientConfigured;
