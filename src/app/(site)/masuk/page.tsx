import Link from "next/link";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import { masuk } from "@/app/actions/auth";

export const metadata = { title: "Masuk" };

export default async function MasukPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "" } = await searchParams;
  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-white">Masuk</h1>
        <p className="text-sm text-neutral-400 mt-1">Masuk dengan nomor HP yang kamu daftarkan.</p>
        <div className="mt-6">
          <PhoneAuthForm mode="masuk" action={masuk} next={next} submitLabel="Masuk" />
        </div>
        <p className="mt-6 text-sm text-center text-neutral-400">
          Belum punya akun? <Link className="link" href={`/daftar${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Daftar</Link>
        </p>
      </div>
    </section>
  );
}
