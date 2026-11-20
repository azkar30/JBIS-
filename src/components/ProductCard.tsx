import Link from "next/link";
import ProductImage from "./ProductImage";
import type { Product } from "@/lib/types";
import { namaProduk, rupiah } from "@/lib/utils";

export default function ProductCard({ p }: { p: Product }) {
  const foto = [...(p.product_photos || [])].sort((a, b) => a.urutan - b.urutan)[0];
  const terjual = p.status === "terjual";
  return (
    <Link
      href={`/produk/${p.id}`}
      className="card group overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-neutral-950 border-b border-neutral-800/60">
        <ProductImage path={foto?.path} alt={namaProduk(p)} className={terjual ? "opacity-40 grayscale" : ""} />
        <span className="absolute top-3 left-3 rounded-md bg-black/85 backdrop-blur-xs px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
          {p.kondisi}
        </span>
        {terjual && (
          <span className="absolute top-3 right-3 rounded-md bg-rose-500/20 backdrop-blur-xs px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
            Terjual
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-base truncate">
          {namaProduk(p)}
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {p.warna} · {p.tipe} · BH {p.battery_health}%
        </p>
        <p className="mt-3 font-extrabold text-emerald-400 text-lg drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">
          {rupiah(p.harga)}
        </p>
      </div>
    </Link>
  );
}
