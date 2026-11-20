import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Profile } from "@/lib/types";

// Supabase client untuk Server Component & Server Action (membaca session dari cookie)
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // dipanggil dari Server Component: abaikan, middleware yang menyegarkan session
          }
        },
      },
    }
  );
}

/** User yang sedang login beserta profilnya (null jika belum login) */
export async function getSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null as Profile | null };
  const { data: profile } = await supabase.from("profiles").select("id, nama, no_hp, role").eq("id", user.id).single();
  return { supabase, user, profile: profile as Profile | null };
}

/** Pastikan pemanggil adalah admin (dipakai di setiap Server Action admin) */
export async function requireAdmin() {
  const s = await getSession();
  if (s.profile?.role !== "admin") throw new Error("Akses ditolak");
  return s;
}
