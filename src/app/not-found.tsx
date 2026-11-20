import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold text-emerald-400 tracking-wider">404 ERROR</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-white">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-neutral-400">Mungkin unitnya sudah dihapus atau link-nya salah.</p>
        <Link href="/katalog" className="btn-primary mt-6">Kembali ke katalog</Link>
      </div>
    </main>
  );
}
