import { createBrowserClient } from '@supabase/ssr'

export async function createClient() {
  const response = await fetch('/api/config');
  const config = await response.json();
  
  return createBrowserClient(
    config.NEXT_PUBLIC_SUPABASE_URL!,
    config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
