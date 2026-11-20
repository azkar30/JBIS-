import Image from "next/image";
import { photoUrl } from "@/lib/utils";

/** Foto produk dari Supabase Storage, atau ilustrasi iPhone bila belum ada foto */
export default function ProductImage({ path, alt, className = "", sizes = "(max-width: 768px) 50vw, 25vw", priority = false }: {
  path?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (path) {
    return <Image src={photoUrl(path)} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`absolute inset-0 grid place-items-center ${className}`}>
      <svg viewBox="0 0 120 220" className="h-3/5 w-auto" aria-hidden="true">
        <rect x="10" y="4" width="100" height="212" rx="18" fill="#cbd5e1" />
        <rect x="18" y="16" width="38" height="38" rx="10" fill="#94a3b8" />
        <circle cx="30" cy="28" r="7" fill="#64748b" />
        <circle cx="44" cy="42" r="7" fill="#64748b" />
      </svg>
    </div>
  );
}
