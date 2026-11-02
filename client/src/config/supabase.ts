import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vlssdxnposqtsdwleukm.supabase.co';
// Strip trailing /rest/v1 or /rest/v1/ if user appended it
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rr-dDX9N53KyYttRNf7wmg_BaErgT3o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
