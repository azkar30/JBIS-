import { STORE } from "./config";

export function rupiah(n: number | string | null | undefined) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export function tanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Ubah 08xx / +628xx / 628xx menjadi 628xx. Null jika tidak valid. */
export function normalizePhone(input: string): string | null {
  let d = (input || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return /^628\d{7,12}$/.test(d) ? d : null;
}

/** Tampilkan 628123... sebagai 08123... */
export function displayPhone(p: string) {
  return p?.startsWith("62") ? "0" + p.slice(2) : p;
}

/**
 * Supabase Auth membutuhkan email untuk login dengan password.
 * Nomor HP dipetakan ke email internal (tidak pernah dikirimi email).
 */
export function phoneToEmail(phone62: string) {
  return `${phone62}@hp.jbisstore.app`;
}

export function waLink(text: string, number = STORE.wa) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function safeNext(next: string | null | undefined, fallback = "/") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export function namaProduk(p: { nama: string; kapasitas: string }) {
  return `${p.nama} ${p.kapasitas}`;
}

export function photoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/produk/${path}`;
}

export function kodePendek(id: string) {
  return id.slice(0, 8).toUpperCase();
}
