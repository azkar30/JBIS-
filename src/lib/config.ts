// Pengaturan toko & daftar pilihan yang dipakai di form

export const STORE = {
  nama: "JBIS",
  tagline: "Jual beli iPhone second terpercaya",
  alamat: "Cibinong, Kabupaten Bogor, Jawa Barat",
  instagram: "jual_beli_iphone_second",
  wa: process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const MODEL_IPHONE = [
  "iPhone XR", "iPhone XS", "iPhone XS Max",
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  "iPhone SE (2020)", "iPhone SE (2022)",
  "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
  "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16e", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone Air", "iPhone 17 Pro", "iPhone 17 Pro Max",
];

export const KAPASITAS = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];

export const TIPE = ["iBox", "Inter", "Digimap", "Erafone", "Lainnya"];

export const KONDISI = [
  { value: "Like New", info: "Mulus seperti baru, tanpa lecet" },
  { value: "Mulus", info: "Lecet sangat halus, hampir tidak terlihat" },
  { value: "Lecet Pemakaian", info: "Ada lecet/baret wajar bekas pemakaian" },
  { value: "Ada Minus", info: "Ada fungsi/fisik yang bermasalah (dijelaskan di catatan)" },
];

export const KELENGKAPAN = ["Dus", "Kabel", "Charger", "Nota / garansi"];

export const STATUS_PENGAJUAN = {
  baru: { label: "Baru", cls: "bg-amber-500/10 text-amber-300 border border-amber-500/30" },
  dihubungi: { label: "Dihubungi", cls: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30" },
  deal: { label: "Deal", cls: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_8px_rgba(0,255,136,0.2)]" },
  batal: { label: "Batal", cls: "bg-neutral-800/80 text-neutral-400 border border-neutral-700" },
} as const;

export const MIN_FOTO = 3;
export const MAX_FOTO = 8;
export const MAX_FOTO_MB = 5;
