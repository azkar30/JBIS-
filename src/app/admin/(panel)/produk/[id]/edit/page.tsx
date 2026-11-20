import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { getProduct } from "@/lib/queries";
import { namaProduk } from "@/lib/utils";

export const metadata = { title: "Edit Produk" };

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const produk = await getProduct(supabase, id);
  if (!produk) notFound();

  return (
    <>
      <Link href="/admin/produk" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
        ← Daftar produk
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold text-white">Edit {namaProduk(produk)}</h1>
      <div className="mt-6">
        <ProductForm produk={produk} />
      </div>
    </>
  );
}
