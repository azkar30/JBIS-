import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import BuyButton from "@/components/BuyButton";
import { getSession } from "@/lib/supabase/server";
import { getProduct } from "@/lib/queries";
import { namaProduk, rupiah, waLink } from "@/lib/utils";
import { KONDISI, STORE } from "@/lib/config";

export default async function ProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getSession();
  const p = await getProduct(supabase, id);
  if (!p) notFound();

  const nama = namaProduk(p);
  const infoKondisi = KONDISI.find((k) => k.value === p.kondisi)?.info;
  const spek: [string, string][] = [
    ["Kapasitas", p.kapasitas],
    ["Warna", p.warna],
    ["Tipe", p.tipe],
    ["Battery health", `${p.battery_health}%`],
    ["Kondisi", p.kondisi],
    ["Kelengkapan", p.kelengkapan],
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/katalog" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 mb-6">
        <span>←</span> Kembali ke katalog
      </Link>
      <div className="grid md:grid-cols-2 gap-10">
        <Gallery photos={p.product_photos} alt={nama} />
        <div>
          <div className="flex gap-2">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              {p.kondisi}
            </span>
            {p.status === "terjual" && (
              <span className="rounded-md bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-400">
                Terjual
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">{nama}</h1>
          <p className="text-neutral-400 mt-1">{p.warna} · {p.tipe}</p>
          <p className="mt-5 text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_12px_rgba(0,255,136,0.35)]">
            {rupiah(p.harga)}
          </p>

          <dl className="mt-6 card divide-y divide-neutral-800 text-sm">
            {spek.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-neutral-400">{k}</dt>
                <dd className="font-semibold text-white text-right">{v}</dd>
              </div>
            ))}
          </dl>

          {(p.catatan_kondisi || infoKondisi) && (
            <div className="mt-4 rounded-xl bg-neutral-900/90 border border-neutral-700/80 p-4 text-sm text-neutral-200">
              <span className="font-semibold text-emerald-400">{p.catatan_kondisi ? "Catatan kondisi:" : `${p.kondisi}:`}</span>{" "}
              {p.catatan_kondisi || infoKondisi}
            </div>
          )}
          {p.deskripsi && <p className="mt-4 text-sm text-neutral-300 whitespace-pre-line leading-relaxed">{p.deskripsi}</p>}

          <div className="mt-8 space-y-3">
            {p.status === "terjual" ? (
              <button className="btn-secondary w-full py-3.5 opacity-60 cursor-not-allowed" disabled>
                Unit sudah terjual
              </button>
            ) : (
              <BuyButton
                id={p.id}
                nama={nama}
                warna={p.warna}
                harga={p.harga}
                tokopedia={p.link_tokopedia}
                shopee={p.link_shopee}
                loggedIn={!!user}
              />
            )}
            <a
              href={waLink(`Halo ${STORE.nama}, saya mau tanya tentang ${nama} ${p.warna}.\n\n${STORE.siteUrl}/produk/${p.id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full py-3.5"
            >
              Tanya dulu lewat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
