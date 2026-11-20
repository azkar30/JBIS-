import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { getKatalog } from "@/lib/queries";
import { STORE } from "@/lib/config";

export const dynamic = "force-dynamic";

const PLACEHOLDER_UNITS = [
  { nama: "iPhone 13", kapasitas: "128GB", warna: "Midnight", harga: "Rp 5.800.000" },
  { nama: "iPhone 13 Pro", kapasitas: "256GB", warna: "Sierra Blue", harga: "Rp 8.200.000" },
  { nama: "iPhone 14", kapasitas: "128GB", warna: "Purple", harga: "Rp 9.500.000" },
  { nama: "iPhone 12", kapasitas: "64GB", warna: "White", harga: "Rp 4.300.000" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const terbaru = await getKatalog(supabase, {}, 8);
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("aktif", true)
    .order("urutan");

  return (
    <>
      <section className="border-b border-neutral-800/80 relative overflow-hidden">
        {/* Subtle background ambient neon glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Beli atau jual iPhone second,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(0,255,136,0.35)]">
                tanpa ribet.
              </span>
            </h1>
            <p className="mt-5 text-neutral-300 text-lg font-medium flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{STORE.alamat}</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/katalog" className="btn-primary px-6 py-3.5 shadow-lg">
                Lihat katalog
              </Link>
              <Link href="/jual" className="btn-secondary px-6 py-3.5 shadow-sm">
                Jual iPhone saya
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["1", "Pilih unit", "Cek foto asli, kondisi, dan battery health."],
              ["2", "Pilih cara beli", "Tokopedia, Shopee, COD, atau ambil di toko."],
              ["3", "Mau jual?", "Isi form, kami hubungi lewat WhatsApp."],
              ["4", "Cek fisik", "Bertemu di toko untuk cek unit & serah terima."],
            ].map(([n, t, d]) => (
              <div key={n} className="card p-5 hover:border-emerald-500/30 transition-all">
                <span className="grid place-items-center h-8 w-8 rounded-xl bg-emerald-400/10 border border-emerald-500/40 text-emerald-400 text-sm font-bold shadow-[0_0_12px_rgba(0,255,136,0.2)]">
                  {n}
                </span>
                <div className="mt-3.5 font-bold text-white">{t}</div>
                <p className="mt-1 text-sm text-neutral-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-white">Unit terbaru</h2>
          <Link href="/katalog" className="link text-sm font-semibold">
            Lihat semua →
          </Link>
        </div>
        {terbaru.length ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {terbaru.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PLACEHOLDER_UNITS.map((u) => (
              <div key={u.nama + u.warna} className="card overflow-hidden hover:border-emerald-500/30 transition-all">
                <div className="bg-neutral-950 h-44 w-full flex items-center justify-center border-b border-neutral-800/80">
                  <svg className="w-14 h-14 text-emerald-400/30 drop-shadow-[0_0_10px_rgba(0,255,136,0.2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="1.5" />
                    <circle cx="12" cy="17" r="1" fill="currentColor" strokeWidth="0" />
                  </svg>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-white text-sm">{u.nama} {u.kapasitas}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{u.warna}</div>
                  <div className="mt-2.5 font-bold text-emerald-400 text-sm drop-shadow-[0_0_6px_rgba(0,255,136,0.3)]">{u.harga}</div>
                  <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-semibold text-emerald-400 py-1.5">
                    Segera tersedia
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {testimonials && testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pt-16">
          <h2 className="text-2xl font-extrabold text-white">Apa kata pelanggan kami</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="card p-6 flex flex-col gap-3.5 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all">
                <div className="text-emerald-400 text-lg tracking-widest drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]">
                  {"★".repeat(t.rating)}<span className="text-neutral-700">{"★".repeat(5 - t.rating)}</span>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed flex-1">{t.pesan}</p>
                <div className="text-sm font-semibold text-white">
                  {t.nama} <span className="font-normal text-neutral-400">· {t.kota}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-8 md:p-12 text-neutral-300 grid md:grid-cols-[1fr_auto] gap-8 items-center shadow-[0_0_50px_rgba(0,255,136,0.08)]">
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              Punya iPhone yang mau dijual?
            </h2>
            <p className="mt-2 text-neutral-300 text-base leading-relaxed">
              Isi spesifikasi dan harga yang kamu mau. Admin JBIS akan membalas lewat WhatsApp untuk jadwal cek fisik.
            </p>
          </div>
          <Link
            href="/jual"
            className="btn-primary px-7 py-3.5 shadow-lg text-base"
          >
            Jual iPhone saya
          </Link>
        </div>
      </section>
    </>
  );
}
