import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Testimoni" };

export default async function AdminTestimoniPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("urutan", { ascending: true });
  const list = data || [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-white">Testimoni</h1>
        <Link href="/admin/testimoni/baru" className="btn-primary">+ Tambah</Link>
      </div>
      <div className="card mt-5 overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kota</th>
              <th>Rating</th>
              <th>Aktif</th>
              <th>Urutan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td className="font-semibold text-white">{t.nama}</td>
                <td className="text-neutral-300">{t.kota}</td>
                <td><span className="text-emerald-400">{"★".repeat(t.rating)}</span><span className="text-neutral-700">{"★".repeat(5 - t.rating)}</span></td>
                <td>
                  {t.aktif
                    ? <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 shadow-[0_0_8px_rgba(0,255,136,0.15)]">Aktif</span>
                    : <span className="rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-xs font-semibold px-2.5 py-0.5">Nonaktif</span>
                  }
                </td>
                <td className="text-neutral-300">{t.urutan}</td>
                <td>
                  <Link href={`/admin/testimoni/${t.id}/edit`} className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={6} className="text-center text-neutral-400 py-10">Belum ada testimoni.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
