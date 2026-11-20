"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";

// Semua aksi di sini memeriksa role admin di server, selain dijaga RLS di database.

export async function hapusProduk(id: string) {
  const { supabase } = await requireAdmin();
  const { data: fotos } = await supabase.from("product_photos").select("path").eq("product_id", id);
  if (fotos?.length) await supabase.storage.from("produk").remove(fotos.map((f) => f.path));
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus produk");
  revalidatePath("/", "layout");
}

export async function setStatusProduk(id: string, status: "tersedia" | "terjual") {
  const { supabase } = await requireAdmin();
  await supabase.from("products").update({ status }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function updatePengajuan(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!["baru", "dihubungi", "deal", "batal"].includes(status)) return;
  await supabase.from("sell_requests")
    .update({ status, catatan_admin: String(form.get("catatan_admin") || "").trim() || null })
    .eq("id", id);
  revalidatePath("/admin/pengajuan");
}
