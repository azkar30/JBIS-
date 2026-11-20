"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({ pengajuanBaru }: { pengajuanBaru: number }) {
  const path = usePathname();
  const menu = [
    { href: "/admin", label: "Dashboard", aktif: path === "/admin" },
    { href: "/admin/produk", label: "Produk", aktif: path === "/admin/produk" || /\/admin\/produk\/[^/]+\/edit/.test(path) },
    { href: "/admin/produk/baru", label: "Upload iPhone Baru", aktif: path === "/admin/produk/baru" },
    { href: "/admin/pengajuan", label: "Pengajuan Jual", aktif: path.startsWith("/admin/pengajuan"), badge: pengajuanBaru },
    { href: "/admin/testimoni", label: "⭐ Testimoni", aktif: path.startsWith("/admin/testimoni") },
  ];
  return (
    <nav className="flex lg:flex-col gap-1.5 p-3 overflow-x-auto text-sm">
      {menu.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 whitespace-nowrap transition-all ${
            m.aktif
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_12px_rgba(0,255,136,0.15)]"
              : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
          }`}
        >
          {m.label}
          {!!m.badge && (
            <span className="rounded-full bg-emerald-400 text-black text-xs font-extrabold px-2 py-0.5">
              {m.badge}
            </span>
          )}
        </Link>
      ))}
      <Link
        href="/"
        className="rounded-xl px-3.5 py-2.5 whitespace-nowrap text-neutral-400 hover:bg-neutral-900 hover:text-emerald-400 transition-colors lg:mt-4"
      >
        Lihat website ↗
      </Link>
    </nav>
  );
}
