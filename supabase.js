import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const enNavegador = typeof window !== 'undefined';

export const supabase = createClient(url, key, {
  auth: { persistSession: enNavegador, autoRefreshToken: enNavegador },
});
