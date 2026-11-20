"use client";

import Link from "next/link";
import { useTransition } from "react";
import { hapusProduk, setStatusProduk } from "@/app/actions/admin";

export default function ProductRowActions({ id, nama, status }: { id: string; nama: string; status: "tersedia" | "terjual" }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex items-center justify-end gap-3 whitespace-nowrap ${pending ? "opacity-50 pointer-events-none" : ""}`}>
      <Link href={`/admin/produk/${id}/edit`} className="link">Edit</Link>
      <button type="button" className="font-semibold text-neutral-400 hover:text-white transition-colors"
        onClick={() => start(() => setStatusProduk(id, status === "tersedia" ? "terjual" : "tersedia"))}>
        {status === "tersedia" ? "Tandai terjual" : "Tandai tersedia"}
      </button>
      <button type="button" className="font-semibold text-rose-400 hover:text-rose-300 transition-colors"
        onClick={() => {
          if (confirm(`Hapus ${nama} beserta semua fotonya? Tindakan ini tidak bisa dibatalkan.`)) start(() => hapusProduk(id));
        }}>
        Hapus
      </button>
    </div>
  );
}
