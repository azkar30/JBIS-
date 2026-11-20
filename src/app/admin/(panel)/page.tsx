import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { kodePendek, rupiah, tanggal } from "@/lib/utils";
import type { SellRequest } from "@/lib/types";

export const metadata = { title: "Dashboard Admin" };

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [tersedia, terjual, baru, nilai, pengajuan] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "tersedia"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "terjual"),
    supabase.from("sell_requests").select("id", { count: "exact", head: true }).eq("status", "baru"),
    supabase.from("products").select("harga").eq("status", "tersedia"),
    supabase.from("sell_requests").select("*").in("status", ["baru", "dihubungi"]).order("created_at", { ascending: false }).limit(6),
  ]);
  const nilaiStok = (nilai.data || []).reduce((s, r) => s + Number(r.harga), 0);

  const kartu = [
    { label: "Produk tersedia", value: String(tersedia.count || 0), href: "/admin/produk" },
    { label: "Nilai stok", value: rupiah(nilaiStok), href: "/admin/produk" },
    { label: "Produk terjual", value: String(terjual.count || 0), href: "/admin/produk?status=terjual" },
    { label: "Pengajuan jual baru", value: String(baru.count || 0), href: "/admin/pengajuan", warn: (baru.count || 0) > 0 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
        <Link href="/admin/produk/baru" className="btn-primary">+ Upload iPhone baru</Link>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kartu.map((k) => (
          <Link key={k.label} href={k.href} className="card p-5 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all">
            <div className="text-sm text-neutral-400">{k.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${k.warn ? "text-amber-400" : "text-white"}`}>{k.value}</div>
          </Link>
        ))}
      </div>

      <div className="card mt-6 overflow-x-auto">
        <div className="px-5 pt-5 flex justify-between items-center">
          <h2 className="font-bold text-white">Pengajuan jual yang perlu ditindaklanjuti</h2>
          <Link className="link text-sm" href="/admin/pengajuan">Semua →</Link>
        </div>
        {(pengajuan.data || []).length ? (
          <table className="table-base mt-3">
            <thead><tr><th>Kode</th><th>Tanggal</th><th>Penjual</th><th>iPhone</th><th className="text-right">Harga diajukan</th><th>Status</th></tr></thead>
            <tbody>
              {(pengajuan.data as SellRequest[]).map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs font-semibold text-emerald-400">#{kodePendek(r.id)}</td>
                  <td className="whitespace-nowrap text-neutral-300">{tanggal(r.created_at)}</td>
                  <td>{r.nama}<div className="text-xs text-neutral-400">{r.domisili}</div></td>
                  <td>{r.model} {r.kapasitas}<div className="text-xs text-neutral-400">BH {r.battery_health}% · {r.kondisi}</div></td>
                  <td className="text-right font-semibold whitespace-nowrap text-white">{rupiah(r.harga_jual)}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-8 text-sm text-neutral-400">Tidak ada pengajuan yang menunggu.</p>
        )}
      </div>
    </>
  );
}
