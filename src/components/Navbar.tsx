import Link from "next/link";
import { getSession } from "@/lib/supabase/server";
import ProfileDropdown from "@/components/ProfileDropdown";

export default async function Navbar() {
  const { profile } = await getSession();
  const menu = [
    { href: "/jual", label: "Jual iPhone Saya" },
    { href: "/katalog", label: "Katalog" },
  ];

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo: "JBIS" with font Montserrat bold and neon dot */}
        <Link href="/" className="flex items-center shrink-0 group">
          <span className="font-montserrat font-bold text-2xl tracking-wider text-white transition-all group-hover:drop-shadow-[0_0_12px_rgba(0,255,136,0.6)]">
            JBIS<span className="text-emerald-400">.</span>
          </span>
        </Link>

        {/* Right side: Nav menu starts from right to left, profile at the left of the last nav menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Profile / Auth on the left side of the last nav menu */}
          <div className="flex items-center">
            {profile ? (
              <ProfileDropdown profile={profile} />
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <Link
                  href="/masuk"
                  className="text-neutral-300 hover:text-white font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs px-4 py-2 transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] active:scale-[0.98]"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Nav menu: Starts from right (Katalog), going left (Jual iPhone Saya) */}
          <nav className="flex items-center gap-6 text-sm">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="text-neutral-300 hover:text-emerald-400 font-medium transition-colors"
              >
                {m.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile profile / auth */}
        <div className="flex md:hidden items-center gap-2">
          {profile ? (
            <ProfileDropdown profile={profile} />
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/masuk"
                className="text-neutral-300 hover:text-white font-medium px-2 py-1"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black px-3 py-1 font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav links: starts from right to left */}
      <nav className="md:hidden border-t border-neutral-800/80 px-4 py-2 flex items-center justify-end gap-5 text-sm bg-black/95">
        {menu.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="text-neutral-300 hover:text-emerald-400 font-medium transition-colors"
          >
            {m.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
