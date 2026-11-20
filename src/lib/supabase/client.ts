import { createBrowserClient } from "@supabase/ssr";

// Supabase client untuk komponen di browser (dipakai untuk upload foto oleh admin)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
