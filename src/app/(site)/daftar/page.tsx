import Link from "next/link";
import PhoneAuthForm from "@/components/PhoneAuthForm";
import { daftar } from "@/app/actions/auth";

export const metadata = { title: "Daftar" };

export default async function DaftarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "" } = await searchParams;
  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-white">Buat akun</h1>
        <p className="text-sm text-neutral-400 mt-1">Cukup nama, nomor HP, dan password.</p>
        <div className="mt-6">
          <PhoneAuthForm mode="daftar" action={daftar} next={next} submitLabel="Daftar" />
        </div>
        <p className="mt-6 text-sm text-center text-neutral-400">
          Sudah punya akun? <Link className="link" href={`/masuk${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Masuk</Link>
        </p>
      </div>
    </section>
  );
}
