import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { getKatalog, type KatalogFilter } from "@/lib/queries";
import { KAPASITAS, MODEL_IPHONE, STORE } from "@/lib/config";

export const metadata = { title: "Katalog" };

export default async function KatalogPage({ searchParams }: { searchParams: Promise<KatalogFilter> }) {
  const f = await searchParams;
  const supabase = await createClient();
  const produk = await getKatalog(supabase, f);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white">Katalog iPhone second</h1>
      <p className="text-neutral-400 mt-2">{produk.length} unit tersedia.</p>

      <form className="card p-5 mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
        <div className="col-span-2 md:col-span-1">
          <label className="label" htmlFor="q">Cari</label>
          <input className="input" id="q" name="q" defaultValue={f.q} placeholder="Contoh: 13 Pro" />
        </div>
        <div>
          <label className="label" htmlFor="model">Model</label>
          <select className="input" id="model" name="model" defaultValue={f.model || ""}>
            <option value="" className="bg-neutral-900 text-white">Semua</option>
            {MODEL_IPHONE.map((m) => (
              <option key={m} value={m} className="bg-neutral-900 text-white">{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="kapasitas">Kapasitas</label>
          <select className="input" id="kapasitas" name="kapasitas" defaultValue={f.kapasitas || ""}>
            <option value="" className="bg-neutral-900 text-white">Semua</option>
            {KAPASITAS.map((k) => (
              <option key={k} value={k} className="bg-neutral-900 text-white">{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="urut">Urutkan</label>
          <select className="input" id="urut" name="urut" defaultValue={f.urut || ""}>
            <option value="" className="bg-neutral-900 text-white">Terbaru</option>
            <option value="termurah" className="bg-neutral-900 text-white">Harga termurah</option>
            <option value="termahal" className="bg-neutral-900 text-white">Harga termahal</option>
          </select>
        </div>
        <div className="col-span-2 md:col-span-1 flex gap-2">
          <button className="btn-primary flex-1">Terapkan</button>
          <Link href="/katalog" className="btn-secondary">Reset</Link>
        </div>
      </form>

      {produk.length ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {produk.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="card p-12 mt-8 text-center text-neutral-400">
          Belum ada unit yang cocok.{" "}
          <a className="link" href={`https://wa.me/${STORE.wa}`} target="_blank" rel="noopener noreferrer">
            Tanya stok lewat WhatsApp
          </a>
        </div>
      )}
    </section>
  );
}
