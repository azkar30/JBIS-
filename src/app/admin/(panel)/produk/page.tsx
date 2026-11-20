import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import ProductRowActions from "@/components/admin/ProductRowActions";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_SELECT } from "@/lib/queries";
import { namaProduk, rupiah, tanggal } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const metadata = { title: "Produk" };

export default async function AdminProdukPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "tersedia", q = "" } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (status === "tersedia" || status === "terjual") query = query.eq("status", status);
  const cari = q.replace(/[%,()]/g, " ").trim();
  if (cari) query = query.or(`nama.ilike.%${cari}%,warna.ilike.%${cari}%`);
  const { data } = await query;
  const produk = (data || []) as Product[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-white">Produk</h1>
        <Link href="/admin/produk/baru" className="btn-primary">+ Upload iPhone baru</Link>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        {[["tersedia", "Tersedia"], ["terjual", "Terjual"], ["semua", "Semua"]].map(([k, l]) => (
          <Link
            key={k}
            href={`/admin/produk?status=${k}`}
            className={`rounded-full px-3.5 py-1.5 transition-all text-xs font-semibold ${
              status === k
                ? "bg-emerald-400 text-black shadow-[0_0_12px_rgba(0,255,136,0.3)]"
                : "bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-emerald-400 hover:text-white"
            }`}
          >
            {l}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          <input type="hidden" name="status" value={status} />
          <input name="q" defaultValue={q} className="input w-56" placeholder="Cari model / warna" />
          <button className="btn-secondary">Cari</button>
        </form>
      </div>
      <div className="card mt-4 overflow-x-auto">
        <table className="table-base">
          <thead><tr><th>Produk</th><th>Kondisi</th><th className="text-right">Harga</th><th>Marketplace</th><th>Ditambahkan</th><th></th></tr></thead>
          <tbody>
            {produk.map((p) => {
              const foto = [...p.product_photos].sort((a, b) => a.urutan - b.urutan)[0];
              return (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800">
                        <ProductImage path={foto?.path} alt={namaProduk(p)} sizes="56px" />
                      </div>
                      <div>
                        <Link href={`/produk/${p.id}`} className="font-semibold text-white hover:text-emerald-400 transition-colors">{namaProduk(p)}</Link>
                        <div className="text-xs text-neutral-400 mt-0.5">{p.warna} · {p.tipe} · {p.product_photos.length} foto</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-white">{p.kondisi}</span><div className="text-xs text-neutral-400">BH {p.battery_health}%</div></td>
                  <td className="text-right font-semibold whitespace-nowrap text-emerald-400">{rupiah(p.harga)}</td>
                  <td className="text-xs">
                    <span className={p.link_tokopedia ? "text-emerald-400" : "text-neutral-500"}>Tokopedia {p.link_tokopedia ? "✓" : "–"}</span><br />
                    <span className={p.link_shopee ? "text-emerald-400" : "text-neutral-500"}>Shopee {p.link_shopee ? "✓" : "–"}</span>
                  </td>
                  <td className="whitespace-nowrap text-neutral-300">{tanggal(p.created_at)}</td>
                  <td><ProductRowActions id={p.id} nama={namaProduk(p)} status={p.status} /></td>
                </tr>
              );
            })}
            {!produk.length && <tr><td colSpan={6} className="text-center text-neutral-400 py-10">Belum ada produk.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
