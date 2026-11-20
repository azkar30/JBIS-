import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { getSession } from "@/lib/supabase/server";
import { displayPhone, kodePendek, rupiah, tanggal } from "@/lib/utils";
import type { SellRequest } from "@/lib/types";

export const metadata = { title: "Akun Saya" };

export default async function AkunPage() {
  const { supabase, user, profile } = await getSession();
  const { data } = await supabase.from("sell_requests").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
  const pengajuan = (data || []) as SellRequest[];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white">Akun saya</h1>
      <div className="card p-6 mt-8 grid sm:grid-cols-2 gap-4 text-sm">
        <div><div className="text-neutral-400">Nama</div><div className="font-semibold text-white mt-0.5">{profile?.nama}</div></div>
        <div><div className="text-neutral-400">Nomor HP</div><div className="font-semibold text-white mt-0.5">{profile && displayPhone(profile.no_hp)}</div></div>
      </div>

      <div className="mt-12 flex items-end justify-between">
        <h2 className="text-xl font-bold text-white">Pengajuan jual iPhone</h2>
        <Link href="/jual" className="link text-sm">+ Ajukan lagi</Link>
      </div>
      {pengajuan.length ? (
        <div className="card mt-4 overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Kode</th><th>Tanggal</th><th>iPhone</th><th className="text-right">Harga diajukan</th><th>Status</th></tr></thead>
            <tbody>
              {pengajuan.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs font-semibold text-emerald-400">#{kodePendek(r.id)}</td>
                  <td className="whitespace-nowrap text-neutral-300">{tanggal(r.created_at)}</td>
                  <td>{r.model} {r.kapasitas}<div className="text-xs text-neutral-400 mt-0.5">{r.warna} · BH {r.battery_health}%</div></td>
                  <td className="text-right font-semibold whitespace-nowrap text-white">{rupiah(r.harga_jual)}</td>
                  <td>
                    <StatusBadge status={r.status} />
                    {r.catatan_admin && <div className="text-xs text-neutral-400 mt-1">{r.catatan_admin}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-10 mt-4 text-center text-neutral-400">Belum ada pengajuan.</div>
      )}
    </section>
  );
}
