export type Photo = { id: string; path: string; urutan: number };

export type Product = {
  id: string;
  nama: string;
  kapasitas: string;
  warna: string;
  tipe: string;
  battery_health: number;
  kondisi: string;
  catatan_kondisi: string | null;
  kelengkapan: string;
  deskripsi: string | null;
  harga: number;
  link_tokopedia: string | null;
  link_shopee: string | null;
  status: "tersedia" | "terjual";
  created_at: string;
  product_photos: Photo[];
};

export type SellRequest = {
  id: string;
  user_id: string;
  nama: string;
  no_hp: string;
  domisili: string;
  model: string;
  kapasitas: string;
  warna: string;
  tipe: string;
  battery_health: number;
  kondisi: string;
  catatan_kondisi: string | null;
  kelengkapan: string;
  harga_jual: number;
  status: "baru" | "dihubungi" | "deal" | "batal";
  catatan_admin: string | null;
  product_id: string | null;
  created_at: string;
};

export type Profile = { id: string; nama: string; no_hp: string; role: "customer" | "admin" };

export type FormState = { error?: string; ok?: boolean } | undefined;
