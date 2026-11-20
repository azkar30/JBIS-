import Link from "next/link";
import AdminLoginForm from "@/components/AdminLoginForm";
import { masukAdmin } from "@/app/actions/auth";

export const metadata = { title: "Login Admin" };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "" } = await searchParams;
  return (
    <main className="min-h-screen grid place-items-center bg-[#06070a] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="font-montserrat font-bold text-white text-3xl tracking-wider">
            JBIS<span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">.</span>
          </span>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 ml-1">
            Admin
          </span>
        </div>
        <div className="card p-8 border border-neutral-800 bg-neutral-950/90 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <h1 className="text-xl font-extrabold text-white">Login admin</h1>
          <p className="text-sm text-neutral-400 mt-1">Khusus pengelola toko.</p>
          <div className="mt-6">
            <AdminLoginForm action={masukAdmin} next={next} />
          </div>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-neutral-400 hover:text-emerald-400 transition-colors">← Kembali ke website</Link>
        </p>
      </div>
    </main>
  );
}
