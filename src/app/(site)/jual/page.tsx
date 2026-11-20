import SellForm from "@/components/SellForm";
import { getSession } from "@/lib/supabase/server";
import { displayPhone } from "@/lib/utils";

export const metadata = { title: "Jual iPhone Saya" };

export default async function JualPage() {
  const { profile } = await getSession(); // halaman ini dilindungi middleware (wajib login)

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white">Jual iPhone saya</h1>
      <p className="text-neutral-400 mt-2 leading-relaxed">
        Isi data di bawah. Setelah dikirim, kamu diarahkan ke WhatsApp JBIS dengan pesan yang sudah terisi.
        Admin akan meninjau dan menentukan jadwal cek fisik & serah terima.
      </p>
      <ol className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
        {["Isi form & kirim", "Chat otomatis ke WhatsApp", "Cek fisik & deal di toko"].map((t, i) => (
          <li key={t} className="flex items-center gap-3 rounded-xl bg-neutral-950/80 border border-neutral-800 px-4 py-3 text-neutral-200">
            <span className="grid place-items-center h-7 w-7 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/40 text-xs font-bold shrink-0">
              {i + 1}
            </span>
            {t}
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <SellForm nama={profile?.nama || ""} noHp={profile ? displayPhone(profile.no_hp) : ""} />
      </div>
    </section>
  );
}
