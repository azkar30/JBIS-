-- =====================================================================
-- DATA CONTOH untuk demo (opsional)
-- Jalankan SETELAH schema.sql. Produk contoh tampil dengan ilustrasi iPhone
-- (tanpa foto). Untuk demo upload foto, tambahkan produk asli dari dashboard admin.
-- Hapus data contoh:  delete from public.products where deskripsi like '[DEMO]%';
-- =====================================================================
insert into public.products
  (nama, kapasitas, warna, tipe, battery_health, kondisi, catatan_kondisi, kelengkapan, deskripsi, harga, link_tokopedia, link_shopee)
values
  ('iPhone 15 Pro', '256GB', 'Natural Titanium', 'iBox', 96, 'Like New', null, 'Dus, Kabel', '[DEMO] Garansi toko 7 hari.', 15900000, 'https://www.tokopedia.com/', 'https://shopee.co.id/'),
  ('iPhone 13', '128GB', 'Midnight', 'iBox', 88, 'Mulus', null, 'Dus, Kabel', '[DEMO] Unit pemakaian pribadi.', 6750000, 'https://www.tokopedia.com/', null),
  ('iPhone 14 Pro Max', '512GB', 'Deep Purple', 'Inter', 91, 'Lecet Pemakaian', 'Baret halus di frame samping', 'Dus', '[DEMO]', 14200000, null, 'https://shopee.co.id/'),
  ('iPhone 12', '64GB', 'Blue', 'Inter', 79, 'Ada Minus', 'Face ID tidak berfungsi', 'Unit saja', '[DEMO]', 4100000, null, null),
  ('iPhone 16', '128GB', 'Pink', 'iBox', 100, 'Like New', null, 'Dus, Kabel, Nota / garansi', '[DEMO] Masih garansi resmi.', 12900000, 'https://www.tokopedia.com/', 'https://shopee.co.id/'),
  ('iPhone 11', '128GB', 'White', 'Inter', 83, 'Mulus', null, 'Dus, Kabel', '[DEMO]', 4350000, null, null);
