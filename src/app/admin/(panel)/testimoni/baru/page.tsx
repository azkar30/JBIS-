import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Tambah Testimoni" };

async function tambahTestimoni(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    nama: formData.get("nama") as string,
    kota: formData.get("kota") as string,
    pesan: formData.get("pesan") as string,
    rating: Number(formData.get("rating")),
    urutan: Number(formData.get("urutan") || 0),
    aktif: formData.get("aktif") === "on",
  });
  if (error) throw new Error(error.message);
  redirect("/admin/testimoni");
}

export default function TestimoniBaruPage() {
  return (
    <>
      <Link href="/admin/testimoni" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
        ← Daftar testimoni
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold text-white">Tambah Testimoni</h1>
      <div className="mt-6 card p-6 max-w-xl">
        <form action={tambahTestimoni} className="space-y-4">
          <div>
            <label className="label" htmlFor="nama">Nama</label>
            <input className="input" id="nama" name="nama" required placeholder="Contoh: Budi Santoso" />
          </div>
          <div>
            <label className="label" htmlFor="kota">Kota</label>
            <input className="input" id="kota" name="kota" required placeholder="Contoh: Bogor" />
          </div>
          <div>
            <label className="label" htmlFor="pesan">Pesan / Ulasan</label>
            <textarea className="input" id="pesan" name="pesan" rows={4} required placeholder="Tulis ulasan pelanggan..." />
          </div>
          <div>
            <label className="label" htmlFor="rating">Rating</label>
            <select className="input" id="rating" name="rating" defaultValue="5">
              <option value="5" className="bg-neutral-900 text-white">★★★★★ (5)</option>
              <option value="4" className="bg-neutral-900 text-white">★★★★☆ (4)</option>
              <option value="3" className="bg-neutral-900 text-white">★★★☆☆ (3)</option>
              <option value="2" className="bg-neutral-900 text-white">★★☆☆☆ (2)</option>
              <option value="1" className="bg-neutral-900 text-white">★☆☆☆☆ (1)</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="urutan">Urutan tampil</label>
            <input className="input" id="urutan" name="urutan" type="number" defaultValue={0} min={0} />
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <input type="checkbox" id="aktif" name="aktif" defaultChecked className="h-4 w-4 rounded accent-emerald-400" />
            <label htmlFor="aktif" className="text-sm font-medium text-neutral-300">Aktifkan (tampil di website)</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary">Simpan</button>
            <Link href="/admin/testimoni" className="btn-secondary">Batal</Link>
          </div>
        </form>
      </div>
    </>
  );
}
