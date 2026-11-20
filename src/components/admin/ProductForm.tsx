"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
import { createClient } from "@/lib/supabase/client";
import { KAPASITAS, KELENGKAPAN, KONDISI, MAX_FOTO, MAX_FOTO_MB, MIN_FOTO, MODEL_IPHONE, TIPE } from "@/lib/config";
import { photoUrl } from "@/lib/utils";
import type { Product } from "@/lib/types";

type FotoItem =
  | { kind: "lama"; id: string; path: string; key: string }
  | { kind: "baru"; file: File; preview: string; key: string };

type Nilai = {
  nama: string; kapasitas: string; warna: string; tipe: string; battery_health: string;
  kondisi: string; catatan_kondisi: string; kelengkapan: string[]; deskripsi: string;
  harga: string; link_tokopedia: string; link_shopee: string; status: "tersedia" | "terjual";
};

/** Perkecil foto di browser (maks 1600px, JPEG) agar upload cepat & hemat storage */
async function kompres(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const skala = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * skala);
  canvas.height = Math.round(bmp.height * skala);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Gagal memproses foto"))), "image/jpeg", 0.85));
}

const fmtRp = (v: string) => { const d = v.replace(/\D/g, ""); return d ? Number(d).toLocaleString("id-ID") : ""; };

export default function ProductForm({ produk, prefill, pengajuanId }: {
  produk?: Product;
  prefill?: Partial<Omit<Nilai, "kelengkapan">> & { kelengkapan?: string };
  pengajuanId?: string;
}) {
  const router = useRouter();
  const inputFile = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [proses, setProses] = useState("");
  const [fotos, setFotos] = useState<FotoItem[]>(
    (produk?.product_photos || []).map((f) => ({ kind: "lama", id: f.id, path: f.path, key: f.id }))
  );
  const [v, setV] = useState<Nilai>({
    nama: produk?.nama || prefill?.nama || "",
    kapasitas: produk?.kapasitas || prefill?.kapasitas || "",
    warna: produk?.warna || prefill?.warna || "",
    tipe: produk?.tipe || prefill?.tipe || "",
    battery_health: String(produk?.battery_health ?? prefill?.battery_health ?? ""),
    kondisi: produk?.kondisi || prefill?.kondisi || "",
    catatan_kondisi: produk?.catatan_kondisi || prefill?.catatan_kondisi || "",
    kelengkapan: (produk?.kelengkapan || prefill?.kelengkapan || "").split(", ").filter((k) => KELENGKAPAN.includes(k)),
    deskripsi: produk?.deskripsi || "",
    harga: produk ? fmtRp(String(produk.harga)) : "",
    link_tokopedia: produk?.link_tokopedia || "",
    link_shopee: produk?.link_shopee || "",
    status: produk?.status || "tersedia",
  });
  const set = <K extends keyof Nilai>(k: K, val: Nilai[K]) => setV((s) => ({ ...s, [k]: val }));

  // bersihkan URL preview saat komponen ditutup
  useEffect(() => () => fotos.forEach((f) => f.kind === "baru" && URL.revokeObjectURL(f.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function tambahFoto(files: FileList | null) {
    if (!files) return;
    setError("");
    const baru: FotoItem[] = [];
    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Foto harus JPG, PNG, atau WEBP."); continue; }
      if (file.size > 15 * 1024 * 1024) { setError(`${file.name} terlalu besar (maks 15 MB sebelum dikompres).`); continue; }
      baru.push({ kind: "baru", file, preview: URL.createObjectURL(file), key: crypto.randomUUID() });
    }
    setFotos((f) => [...f, ...baru].slice(0, MAX_FOTO));
    if (inputFile.current) inputFile.current.value = "";
  }

  function geser(i: number, arah: -1 | 1) {
    setFotos((f) => {
      const j = i + arah;
      if (j < 0 || j >= f.length) return f;
      const c = [...f];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  }

  function validasi(): string | null {
    if (fotos.length < MIN_FOTO) return `Upload minimal ${MIN_FOTO} foto (sekarang ${fotos.length}).`;
    if (!MODEL_IPHONE.includes(v.nama)) return "Pilih model iPhone.";
    if (!KAPASITAS.includes(v.kapasitas)) return "Pilih kapasitas.";
    if (!v.warna.trim()) return "Warna wajib diisi.";
    if (!v.tipe) return "Pilih tipe.";
    const bh = Number(v.battery_health);
    if (!(bh >= 1 && bh <= 100)) return "Battery health harus 1–100.";
    if (!v.kondisi) return "Pilih kondisi.";
    if (v.kondisi === "Ada Minus" && !v.catatan_kondisi.trim()) return "Jelaskan minusnya di catatan kondisi.";
    if (!(Number(v.harga.replace(/\D/g, "")) >= 100000)) return "Harga tidak valid.";
    if (v.link_tokopedia && !/^https:\/\/([\w-]+\.)*tokopedia\.(com|link)\//.test(v.link_tokopedia)) return "Link Tokopedia harus diawali https://www.tokopedia.com/ atau https://tokopedia.link/";
    if (v.link_shopee && !/^https:\/\/([\w-]+\.)*(shopee\.co\.id|shp\.ee)\//.test(v.link_shopee)) return "Link Shopee harus diawali https://shopee.co.id/ atau https://shp.ee/";
    return null;
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    const err = validasi();
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setError("");
    const supabase = createClient();
    const id = produk?.id || crypto.randomUUID();
    const diupload: string[] = [];

    try {
      // 1. Upload foto baru ke Storage
      const baru = fotos.filter((f) => f.kind === "baru");
      for (let i = 0; i < baru.length; i++) {
        setProses(`Mengunggah foto ${i + 1} dari ${baru.length}...`);
        const blob = await kompres((baru[i] as Extract<FotoItem, { kind: "baru" }>).file);
        if (blob.size > MAX_FOTO_MB * 1024 * 1024) throw new Error("Foto terlalu besar setelah dikompres.");
        const path = `${id}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage.from("produk").upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw new Error("Upload foto gagal: " + error.message);
        diupload.push(path);
        (baru[i] as FotoItem & { path?: string }).path = path;
      }

      // 2. Simpan data produk
      setProses("Menyimpan data produk...");
      const data = {
        nama: v.nama, kapasitas: v.kapasitas, warna: v.warna.trim(), tipe: v.tipe,
        battery_health: Number(v.battery_health), kondisi: v.kondisi,
        catatan_kondisi: v.catatan_kondisi.trim() || null,
        kelengkapan: v.kelengkapan.length ? v.kelengkapan.join(", ") : "Unit saja",
        deskripsi: v.deskripsi.trim() || null,
        harga: Number(v.harga.replace(/\D/g, "")),
        link_tokopedia: v.link_tokopedia.trim() || null,
        link_shopee: v.link_shopee.trim() || null,
        status: v.status,
      };
      const res = produk
        ? await supabase.from("products").update(data).eq("id", id)
        : await supabase.from("products").insert({ id, ...data });
      if (res.error) throw new Error("Gagal menyimpan produk: " + res.error.message);

      // 3. Sinkronkan daftar foto (hapus yang dibuang, simpan urutan)
      const lamaDipakai = new Set(fotos.filter((f) => f.kind === "lama").map((f) => (f as { id: string }).id));
      const dibuang = (produk?.product_photos || []).filter((f) => !lamaDipakai.has(f.id));
      if (dibuang.length) {
        await supabase.from("product_photos").delete().in("id", dibuang.map((f) => f.id));
        await supabase.storage.from("produk").remove(dibuang.map((f) => f.path));
      }
      for (let i = 0; i < fotos.length; i++) {
        const f = fotos[i] as FotoItem & { path?: string };
        const r = f.kind === "lama"
          ? await supabase.from("product_photos").update({ urutan: i }).eq("id", f.id)
          : await supabase.from("product_photos").insert({ product_id: id, path: f.path, urutan: i });
        if (r.error) throw new Error("Gagal menyimpan foto: " + r.error.message);
      }

      // 4. Jika berasal dari pengajuan jual, tandai pengajuan sebagai deal
      if (pengajuanId && !produk) {
        await supabase.from("sell_requests").update({ status: "deal", product_id: id }).eq("id", pengajuanId);
      }

      router.push("/admin/produk");
      router.refresh();
    } catch (ex) {
      if (!produk && diupload.length) await supabase.storage.from("produk").remove(diupload);
      setError(ex instanceof Error ? ex.message : "Terjadi kesalahan.");
      setProses("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={simpan} noValidate className="space-y-6 max-w-4xl">
      {error && <Alert>{error}</Alert>}

      <section className="card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-bold text-white text-base">Foto iPhone</h2>
          <span className={`text-sm ${fotos.length >= MIN_FOTO ? "text-emerald-400 font-semibold" : "text-amber-400"}`}>
            {fotos.length}/{MAX_FOTO} foto · minimal {MIN_FOTO}
          </span>
        </div>
        <p className="text-sm text-neutral-400 mt-1">Foto pertama menjadi foto utama di katalog. Gunakan tombol panah untuk mengatur urutan.</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fotos.map((f, i) => (
            <div key={f.key} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.kind === "lama" ? photoUrl(f.path) : f.preview} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute top-2 left-2 rounded bg-emerald-400 text-black px-1.5 py-0.5 text-[11px] font-extrabold shadow-[0_0_8px_rgba(0,255,136,0.4)]">Utama</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/90 to-transparent p-2">
                <div className="flex gap-1">
                  <button type="button" onClick={() => geser(i, -1)} disabled={i === 0} className="h-7 w-7 rounded bg-neutral-900 border border-neutral-700 text-white text-sm disabled:opacity-30" aria-label="Geser kiri">←</button>
                  <button type="button" onClick={() => geser(i, 1)} disabled={i === fotos.length - 1} className="h-7 w-7 rounded bg-neutral-900 border border-neutral-700 text-white text-sm disabled:opacity-30" aria-label="Geser kanan">→</button>
                </div>
                <button type="button" onClick={() => setFotos((s) => s.filter((x) => x.key !== f.key))} className="h-7 rounded bg-rose-600 px-2 text-xs font-semibold text-white">Hapus</button>
              </div>
            </div>
          ))}
          {fotos.length < MAX_FOTO && (
            <button type="button" onClick={() => inputFile.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-neutral-800 text-neutral-400 hover:border-emerald-400 hover:text-emerald-400 grid place-items-center text-sm font-semibold transition-all">
              + Tambah foto
            </button>
          )}
        </div>
        <input ref={inputFile} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => tambahFoto(e.target.files)} />
      </section>

      <section className="card p-6 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-bold text-white text-base">Data & spesifikasi</h2>
        <div>
          <label className="label" htmlFor="nama">Model</label>
          <select className="input" id="nama" value={v.nama} onChange={(e) => set("nama", e.target.value)} required>
            <option value="" disabled className="bg-neutral-900 text-neutral-500">Pilih model</option>
            {MODEL_IPHONE.map((m) => <option key={m} value={m} className="bg-neutral-900 text-white">{m}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="kapasitas">Kapasitas</label>
          <select className="input" id="kapasitas" value={v.kapasitas} onChange={(e) => set("kapasitas", e.target.value)} required>
            <option value="" disabled className="bg-neutral-900 text-neutral-500">Pilih kapasitas</option>
            {KAPASITAS.map((k) => <option key={k} value={k} className="bg-neutral-900 text-white">{k}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="warna">Warna</label>
          <input className="input" id="warna" value={v.warna} onChange={(e) => set("warna", e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="tipe">Tipe</label>
          <select className="input" id="tipe" value={v.tipe} onChange={(e) => set("tipe", e.target.value)} required>
            <option value="" disabled className="bg-neutral-900 text-neutral-500">Pilih tipe</option>
            {TIPE.map((t) => <option key={t} value={t} className="bg-neutral-900 text-white">{t}</option>)}
          </select>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-bold text-white text-base">Kondisi</h2>
        <div className="sm:w-1/2">
          <label className="label" htmlFor="bh">Battery health (%)</label>
          <input className="input" id="bh" type="number" min={1} max={100} value={v.battery_health} onChange={(e) => set("battery_health", e.target.value)} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {KONDISI.map((k) => (
            <label key={k.value} className="flex gap-3 rounded-xl border border-neutral-800 bg-black/60 px-3.5 py-3 text-sm cursor-pointer transition-all has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-950/20 has-[:checked]:shadow-[0_0_15px_rgba(0,255,136,0.15)]">
              <input type="radio" name="kondisi" value={k.value} checked={v.kondisi === k.value} onChange={() => set("kondisi", k.value)} className="mt-0.5 accent-emerald-400" />
              <span><span className="font-semibold text-white">{k.value}</span><span className="block text-xs text-neutral-400 mt-0.5">{k.info}</span></span>
            </label>
          ))}
        </div>
        <div>
          <label className="label" htmlFor="catatan">Catatan kondisi {v.kondisi === "Ada Minus" ? "(wajib)" : "(opsional)"}</label>
          <textarea className="input" id="catatan" rows={2} value={v.catatan_kondisi} onChange={(e) => set("catatan_kondisi", e.target.value)} />
        </div>
        <div>
          <span className="label">Kelengkapan</span>
          <div className="flex flex-wrap gap-2.5">
            {KELENGKAPAN.map((k) => (
              <label key={k} className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-black/60 px-3.5 py-2 text-sm cursor-pointer transition-all has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-950/20 has-[:checked]:shadow-[0_0_12px_rgba(0,255,136,0.15)] text-neutral-200">
                <input type="checkbox" checked={v.kelengkapan.includes(k)} className="accent-emerald-400"
                  onChange={(e) => set("kelengkapan", e.target.checked ? [...v.kelengkapan, k] : v.kelengkapan.filter((x) => x !== k))} /> {k}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="deskripsi">Deskripsi tambahan (opsional)</label>
          <textarea className="input" id="deskripsi" rows={3} value={v.deskripsi} onChange={(e) => set("deskripsi", e.target.value)}
            placeholder="Contoh: garansi toko 7 hari, sudah ganti baterai di iBox" />
        </div>
      </section>

      <section className="card p-6 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-bold text-white text-base">Harga & link marketplace</h2>
        <div>
          <label className="label" htmlFor="harga">Harga jual</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">Rp</span>
            <input className="input pl-10" id="harga" inputMode="numeric" value={v.harga} onChange={(e) => set("harga", fmtRp(e.target.value))} required />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select className="input" id="status" value={v.status} onChange={(e) => set("status", e.target.value as Nilai["status"])}>
            <option value="tersedia" className="bg-neutral-900 text-white">Tersedia</option>
            <option value="terjual" className="bg-neutral-900 text-white">Terjual</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="tokped">Link produk Tokopedia (opsional)</label>
          <input className="input" id="tokped" type="url" value={v.link_tokopedia} onChange={(e) => set("link_tokopedia", e.target.value)} placeholder="https://www.tokopedia.com/..." />
        </div>
        <div>
          <label className="label" htmlFor="shopee">Link produk Shopee (opsional)</label>
          <input className="input" id="shopee" type="url" value={v.link_shopee} onChange={(e) => set("link_shopee", e.target.value)} placeholder="https://shopee.co.id/..." />
        </div>
        <p className="sm:col-span-2 text-xs text-neutral-400">Jika link dikosongkan, tombol beli via marketplace tersebut tidak aktif. COD dan ambil di toko selalu tersedia lewat WhatsApp.</p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary px-6 py-3" disabled={!!proses}>{proses || (produk ? "Simpan perubahan" : "Upload iPhone")}</button>
        <button type="button" className="btn-secondary px-6 py-3" onClick={() => router.back()} disabled={!!proses}>Batal</button>
      </div>
    </form>
  );
}
