"use server";

import { getSession } from "@/lib/supabase/server";
import { KAPASITAS, KELENGKAPAN, KONDISI, MODEL_IPHONE, STORE, TIPE } from "@/lib/config";
import { kodePendek, normalizePhone, rupiah, waLink, displayPhone } from "@/lib/utils";

export type JualState = { error?: string; waUrl?: string } | undefined;

// Simpan pengajuan "Jual iPhone Saya" lalu kembalikan link WhatsApp berisi template pesan
export async function kirimPengajuan(_: JualState, form: FormData): Promise<JualState> {
  const { supabase, user } = await getSession();
  if (!user) return { error: "Silakan masuk terlebih dahulu." };

  const s = (k: string) => String(form.get(k) || "").trim();
  const nama = s("nama");
  const no_hp = normalizePhone(s("no_hp"));
  const domisili = s("domisili");
  const model = s("model");
  const kapasitas = s("kapasitas");
  const warna = s("warna");
  const tipe = s("tipe");
  const battery_health = parseInt(s("battery_health"), 10);
  const kondisi = s("kondisi");
  const catatan_kondisi = s("catatan_kondisi");
  const kelengkapanList = form.getAll("kelengkapan").map(String).filter((k) => KELENGKAPAN.includes(k));
  const kelengkapan = kelengkapanList.length ? kelengkapanList.join(", ") : "Unit saja";
  const harga_jual = parseInt(s("harga_jual").replace(/\D/g, ""), 10);

  if (nama.length < 2) return { error: "Nama wajib diisi." };
  if (!no_hp) return { error: "Nomor HP tidak valid." };
  if (!domisili) return { error: "Domisili wajib diisi." };
  if (!MODEL_IPHONE.includes(model)) return { error: "Pilih model iPhone." };
  if (!KAPASITAS.includes(kapasitas)) return { error: "Pilih kapasitas." };
  if (!warna) return { error: "Warna wajib diisi." };
  if (!TIPE.includes(tipe)) return { error: "Pilih tipe." };
  if (!(battery_health >= 1 && battery_health <= 100)) return { error: "Battery health harus 1–100." };
  if (!KONDISI.some((k) => k.value === kondisi)) return { error: "Pilih kondisi." };
  if (kondisi === "Ada Minus" && !catatan_kondisi) return { error: "Jelaskan minusnya di catatan kondisi." };
  if (!(harga_jual >= 100000)) return { error: "Harga jual tidak valid." };

  const { data, error } = await supabase.from("sell_requests").insert({
    user_id: user.id, nama, no_hp, domisili, model, kapasitas, warna, tipe, battery_health,
    kondisi, catatan_kondisi: catatan_kondisi || null, kelengkapan, harga_jual,
  }).select("id").single();
  if (error) return { error: "Gagal menyimpan pengajuan. Coba lagi." };

  const pesan = [
    `Halo ${STORE.nama}, saya ${nama} dari ${domisili}. Saya mau menjual iPhone saya:`,
    ``,
    `• Model: ${model} ${kapasitas}`,
    `• Warna: ${warna}`,
    `• Tipe: ${tipe}`,
    `• Battery health: ${battery_health}%`,
    `• Kondisi: ${kondisi}${catatan_kondisi ? ` (${catatan_kondisi})` : ""}`,
    `• Kelengkapan: ${kelengkapan}`,
    `• Harga yang saya tawarkan: ${rupiah(harga_jual)}`,
    ``,
    `No. HP: ${displayPhone(no_hp)}`,
    `Kode pengajuan: #${kodePendek(data.id)}`,
  ].join("\n");

  return { waUrl: waLink(pesan) };
}
