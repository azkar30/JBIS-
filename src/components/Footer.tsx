import Link from "next/link";
import { STORE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-black/90 backdrop-blur-md mt-20 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          {/* Logo "JBIS" with font Montserrat bold */}
          <div className="font-montserrat font-bold text-2xl tracking-wider text-white">
            JBIS<span className="text-emerald-400">.</span>
          </div>
          <p className="text-neutral-400 mt-2 leading-relaxed">
            {STORE.tagline}. {STORE.alamat}.
          </p>
        </div>
        <div className="space-y-2.5">
          <div className="font-bold text-white uppercase tracking-wider text-xs">Menu</div>
          <Link className="block hover:text-emerald-400 transition-colors" href="/katalog">
            Katalog
          </Link>
          <Link className="block hover:text-emerald-400 transition-colors" href="/jual">
            Jual iPhone Saya
          </Link>
          <Link className="block text-neutral-400 hover:text-emerald-400 transition-colors font-medium" href="/admin">
            Portal Admin
          </Link>
        </div>
        <div className="space-y-2.5">
          <div className="font-bold text-white uppercase tracking-wider text-xs">Kontak</div>
          <a
            className="block hover:text-emerald-400 transition-colors"
            href={`https://wa.me/${STORE.wa}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp toko
          </a>
          <a
            className="block hover:text-emerald-400 transition-colors"
            href={`https://instagram.com/${STORE.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram @{STORE.instagram}
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <div>© {new Date().getFullYear()} JBIS. All rights reserved.</div>
          <Link
            href="/admin"
            className="text-neutral-500 hover:text-emerald-400 transition-colors underline-offset-2 hover:underline"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
