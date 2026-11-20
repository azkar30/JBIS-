import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "./types";

export const PRODUCT_SELECT = "*, product_photos(id, path, urutan)";

export type KatalogFilter = { q?: string; model?: string; kapasitas?: string; urut?: string };

export async function getKatalog(supabase: SupabaseClient, f: KatalogFilter = {}, limit?: number) {
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("status", "tersedia");
  if (f.model) query = query.eq("nama", f.model);
  if (f.kapasitas) query = query.eq("kapasitas", f.kapasitas);
  if (f.q) {
    const q = f.q.replace(/[%,()]/g, " ").trim();
    if (q) query = query.or(`nama.ilike.%${q}%,warna.ilike.%${q}%,kapasitas.ilike.%${q}%`);
  }
  if (f.urut === "termurah") query = query.order("harga", { ascending: true });
  else if (f.urut === "termahal") query = query.order("harga", { ascending: false });
  else query = query.order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) console.error(error);
  return (data || []) as Product[];
}

export async function getProduct(supabase: SupabaseClient, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).single();
  if (!data) return null;
  const p = data as Product;
  p.product_photos = [...(p.product_photos || [])].sort((a, b) => a.urutan - b.urutan);
  return p;
}
