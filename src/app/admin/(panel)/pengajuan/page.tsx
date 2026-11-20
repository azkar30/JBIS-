import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { updatePengajuan } from "@/app/actions/admin";
import { STATUS_PENGAJUAN } from "@/lib/config";
import { displayPhone, kodePendek, rupiah, tanggal } from "@/lib/utils";
import type { SellRequest } from "@/lib/types";

export const metadata = { title: "Pengajuan Jual" };

export default async function PengajuanPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "aktif" } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("sell_requests").select("*").order("created_at", { ascending: false });
  if (status === "aktif") query = query.in("status", ["baru", "dihubungi"]);
  else if (status in STATUS_PENGAJUAN) query = query.eq("status", status);
  const { data } = await query;
  const rows = (data || []) as SellRequest[];

  const tabs = [["aktif", "Perlu tindak lanjut"], ["baru", "Baru"], ["dihubungi", "Dihubungi"], ["deal", "Deal"], ["batal", "Batal"], ["semua", "Semua"]];

  return (
    <>
      <h1 className="text-2xl font-extrabold text-white">Pengajuan jual iPhone</h1>
      <p className="text-sm text-neutral-400 mt-1">Dari menu &ldquo;Jual iPhone Saya&rdquo;. Ubah status setelah menghubungi penjual. Jika deal, jadikan produk.</p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        {tabs.map(([k, l]) => (
          <Link
            key={k}
            href={`/admin/pengajuan?status=${k}`}
            className={`rounded-full px-3.5 py-1.5 transition-all text-xs font-semibold ${
              status === k
                ? "bg-emerald-400 text-black shadow-[0_0_12px_rgba(0,255,136,0.3)]"
                : "bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-emerald-400 hover:text-white"
            }`}
          >
            {l}
          </Link>
        ))}
      </div>

      <div className="mt-4 grid xl:grid-cols-2 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-white">{r.model} {r.kapasitas} · {r.warna}</div>
                <div className="text-xs text-neutral-400 mt-0.5">#{kodePendek(r.id)} · {tanggal(r.created_at)}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-neutral-400">Penjual</dt><dd className="font-medium text-white">{r.nama} · {r.domisili}</dd></div>
              <div><dt className="text-neutral-400">WhatsApp</dt><dd><a className="link" href={`https://wa.me/${r.no_hp}`} target="_blank" rel="noopener noreferrer">{displayPhone(r.no_hp)}</a></dd></div>
              <div><dt className="text-neutral-400">Tipe · BH</dt><dd className="text-white">{r.tipe} · {r.battery_health}%</dd></div>
              <div><dt className="text-neutral-400">Harga diajukan</dt><dd className="font-semibold text-emerald-400">{rupiah(r.harga_jual)}</dd></div>
              <div className="col-span-2"><dt className="text-neutral-400">Kondisi</dt><dd className="text-white">{r.kondisi}{r.catatan_kondisi ? ` — ${r.catatan_kondisi}` : ""}</dd></div>
              <div className="col-span-2"><dt className="text-neutral-400">Kelengkapan</dt><dd className="text-white">{r.kelengkapan}</dd></div>
            </dl>
            <form action={updatePengajuan} className="mt-4 border-t border-neutral-800 pt-4 grid sm:grid-cols-[140px_1fr_auto] gap-2">
              <input type="hidden" name="id" value={r.id} />
              <select name="status" defaultValue={r.status} className="input">
                {Object.entries(STATUS_PENGAJUAN).map(([k, s]) => <option key={k} value={k} className="bg-neutral-900 text-white">{s.label}</option>)}
              </select>
              <input name="catatan_admin" defaultValue={r.catatan_admin || ""} className="input" placeholder="Catatan (mis. jadwal cek fisik)" />
              <button className="btn-secondary">Simpan</button>
            </form>
            <div className="mt-3 flex justify-end">
              {r.product_id ? (
                <Link className="link text-sm" href={`/admin/produk/${r.product_id}/edit`}>Lihat produk →</Link>
              ) : r.status !== "batal" && (
                <Link className="btn-primary text-sm py-1.5 px-3" href={`/admin/produk/baru?dari=${r.id}`}>Jadikan produk</Link>
              )}
            </div>
          </div>
        ))}
        {!rows.length && <div className="card p-10 text-center text-neutral-400 xl:col-span-2">Tidak ada pengajuan.</div>}
      </div>
    </>
  );
}
