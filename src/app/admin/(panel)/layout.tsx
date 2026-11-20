import AdminNav from "@/components/admin/AdminNav";
import { getSession } from "@/lib/supabase/server";
import { keluar } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, profile } = await getSession(); // akses admin sudah dicek di middleware
  const { count } = await supabase.from("sell_requests").select("id", { count: "exact", head: true }).eq("status", "baru");

  return (
    <div className="lg:flex min-h-screen bg-[#06070a] text-neutral-200">
      <aside className="lg:w-60 lg:shrink-0 bg-black text-neutral-300 lg:min-h-screen border-r border-neutral-800">
        <div className="h-16 px-5 flex items-center gap-2 border-b border-neutral-800">
          <span className="font-montserrat font-bold text-white text-xl tracking-wider">
            JBIS<span className="text-emerald-400">.</span>
          </span>
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            Admin
          </span>
        </div>
        <AdminNav pengajuanBaru={count || 0} />
      </aside>
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-6 flex items-center justify-end gap-4 text-sm">
          <span className="text-neutral-300">{profile?.nama}</span>
          <form action={keluar}>
            <button className="text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer">Keluar</button>
          </form>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
