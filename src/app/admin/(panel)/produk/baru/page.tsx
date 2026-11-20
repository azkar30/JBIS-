import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { kodePendek } from "@/lib/utils";
import type { SellRequest } from "@/lib/types";

export const metadata = { title: "Upload iPhone Baru" };

export default async function ProdukBaruPage({ searchParams }: { searchParams: Promise<{ dari?: string }> }) {
  const { dari } = await searchParams;
  let pengajuan: SellRequest | null = null;
  if (dari && /^[0-9a-f-]{36}$/i.test(dari)) {
    const supabase = await createClient();
    const { data } = await supabase.from("sell_requests").select("*").eq("id", dari).single();
    pengajuan = data as SellRequest | null;
  }

  return (
    <>
      <Link href="/admin/produk" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
        ← Daftar produk
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold text-white">Upload iPhone baru</h1>
      {pengajuan && (
        <p className="mt-1 text-sm text-neutral-300">
          Data diisi dari pengajuan <span className="font-mono font-semibold text-emerald-400">#{kodePendek(pengajuan.id)}</span> ({pengajuan.nama}). Periksa lagi sesuai hasil cek fisik, lalu tambahkan foto dan harga jual.
        </p>
      )}
      <div className="mt-6">
        <ProductForm
          pengajuanId={pengajuan?.id}
          prefill={pengajuan ? {
            nama: pengajuan.model, kapasitas: pengajuan.kapasitas, warna: pengajuan.warna, tipe: pengajuan.tipe,
            battery_health: String(pengajuan.battery_health), kondisi: pengajuan.kondisi,
            catatan_kondisi: pengajuan.catatan_kondisi || "",
            kelengkapan: pengajuan.kelengkapan,
          } : undefined}
        />
      </div>
    </>
  );
}
