"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";
import type { Photo } from "@/lib/types";

export default function Gallery({ photos, alt }: { photos: Photo[]; alt: string }) {
  const [aktif, setAktif] = useState(0);
  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
        <ProductImage path={photos[aktif]?.path} alt={alt} sizes="(max-width: 768px) 100vw, 50vw" priority />
      </div>
      {photos.length > 1 && (
        <div className="mt-3.5 grid grid-cols-5 gap-2.5">
          {photos.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setAktif(i)}
              aria-label={`Foto ${i + 1}`}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                i === aktif
                  ? "border-emerald-400 shadow-[0_0_12px_rgba(0,255,136,0.4)]"
                  : "border-neutral-800 opacity-60 hover:opacity-100"
              }`}
            >
              <ProductImage path={f.path} alt={`${alt} foto ${i + 1}`} sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
