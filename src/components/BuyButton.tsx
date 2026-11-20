"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STORE } from "@/lib/config";
import { rupiah, waLink } from "@/lib/utils";

type Props = {
  id: string;
  nama: string;          // contoh: iPhone 17 2TB
  warna: string;
  harga: number;
  tokopedia: string | null;
  shopee: string | null;
  loggedIn: boolean;
};

// Tombol "Beli" + pilihan: Tokopedia, Shopee, COD (WA), Ambil di toko (WA)
export default function BuyButton({ id, nama, warna, harga, tokopedia, shopee, loggedIn }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!loggedIn) {
    return (
      <Link href={`/masuk?next=/produk/${id}`} className="btn-primary w-full py-3.5">
        Masuk untuk membeli
      </Link>
    );
  }

  const link = `${STORE.siteUrl}/produk/${id}`;
  const unit = `${nama} ${warna}`;
  const opsi = [
    { key: "tokopedia", label: "Beli di Tokopedia", desc: "Bayar & kirim lewat Tokopedia", href: tokopedia, cls: "bg-[#03AC0E] text-white hover:brightness-110" },
    { key: "shopee", label: "Beli di Shopee", desc: "Bayar & kirim lewat Shopee", href: shopee, cls: "bg-[#EE4D2D] text-white hover:brightness-110" },
    {
      key: "cod", label: "COD", desc: "Bayar di tempat, wilayah Jabodetabek", cls: "bg-neutral-900 border border-neutral-700 text-white hover:border-emerald-400 hover:text-emerald-300",
      href: waLink(`Halo ${STORE.nama}, saya berminat membeli ${unit} (${rupiah(harga)}) melalui COD.\n\nLink produk: ${link}`),
    },
    {
      key: "toko", label: "Ambil langsung di toko", desc: STORE.alamat, cls: "bg-neutral-900 border border-neutral-700 text-white hover:border-emerald-400 hover:text-emerald-300",
      href: waLink(`Halo ${STORE.nama}, saya berminat membeli ${unit} (${rupiah(harga)}) dan ingin datang langsung ke toko. Kapan saya bisa datang?\n\nLink produk: ${link}`),
    },
  ];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary w-full py-3.5">
        Beli
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Pilih cara membeli"
        >
          <div className="card w-full max-w-md p-6 bg-neutral-950/95 border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Pilih cara membeli</h2>
                <p className="text-sm text-neutral-400">{unit} · <span className="text-emerald-400 font-semibold">{rupiah(harga)}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-white text-2xl leading-none transition-colors"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {opsi.map((o) =>
                o.href ? (
                  <a
                    key={o.key}
                    href={o.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${o.cls}`}
                  >
                    <span>
                      <span className="block font-semibold">{o.label}</span>
                      <span className="block text-xs opacity-80">{o.desc}</span>
                    </span>
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <div key={o.key} className="flex items-center justify-between rounded-xl px-4 py-3 bg-neutral-900 border border-neutral-800 text-neutral-500">
                    <span>
                      <span className="block font-semibold">{o.label}</span>
                      <span className="block text-xs">Belum tersedia untuk unit ini</span>
                    </span>
                  </div>
                )
              )}
            </div>
            <p className="mt-4 text-xs text-neutral-400">COD dan ambil di toko akan membuka WhatsApp dengan pesan yang sudah terisi.</p>
          </div>
        </div>
      )}
    </>
  );
}
