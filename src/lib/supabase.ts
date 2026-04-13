import { createClient } from '@supabase/supabase-js';

// We fetch the config from our own API to avoid needing VITE_ prefixes on secrets
let supabaseInstance: any = null;

export async function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      console.warn('Supabase configuration missing from backend');
      return null;
    }

    supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}
