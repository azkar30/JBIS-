-- =====================================================================
-- JBIS Store — skema database Supabase
-- Jalankan sekali di Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------- 1. Profil pengguna (terhubung ke auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null,
  no_hp text not null unique,                 -- format 62xxxxxxxxxx
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Profil dibuat otomatis saat user mendaftar (data dari metadata signUp)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nama, no_hp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama', 'Pengguna'),
    coalesce(new.raw_user_meta_data ->> 'no_hp', new.id::text)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fungsi bantu: apakah user yang sedang login adalah admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- 2. Produk (iPhone di katalog) ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  nama text not null,                          -- contoh: iPhone 13 Pro
  kapasitas text not null,                     -- contoh: 256GB
  warna text not null,
  tipe text not null default 'Inter',          -- iBox / Inter / Digimap / dll
  battery_health int not null check (battery_health between 1 and 100),
  kondisi text not null,                       -- Like New / Mulus / Lecet Pemakaian / Ada Minus
  catatan_kondisi text,                        -- penjelasan minus / detail
  kelengkapan text not null,                   -- contoh: Dus, kabel
  deskripsi text,
  harga bigint not null check (harga > 0),
  link_tokopedia text,
  link_shopee text,
  status text not null default 'tersedia' check (status in ('tersedia', 'terjual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_photos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  path text not null,                          -- path file di Storage bucket "produk"
  urutan int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_photos_product_idx on public.product_photos (product_id, urutan);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------- 3. Pengajuan "Jual iPhone Saya" ----------
create table if not exists public.sell_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nama text not null,
  no_hp text not null,
  domisili text not null,
  model text not null,
  kapasitas text not null,
  warna text not null,
  tipe text not null,
  battery_health int not null check (battery_health between 1 and 100),
  kondisi text not null,
  catatan_kondisi text,
  kelengkapan text not null,
  harga_jual bigint not null check (harga_jual > 0),
  status text not null default 'baru' check (status in ('baru', 'dihubungi', 'deal', 'batal')),
  catatan_admin text,
  product_id uuid references public.products (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists sell_requests_touch on public.sell_requests;
create trigger sell_requests_touch before update on public.sell_requests
  for each row execute function public.touch_updated_at();

-- ---------- 4. Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_photos enable row level security;
alter table public.sell_requests enable row level security;

-- profiles: user melihat profilnya sendiri, admin melihat semua. Tidak ada yang bisa ubah role lewat API.
drop policy if exists "profil sendiri atau admin" on public.profiles;
create policy "profil sendiri atau admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- products & photos: semua orang boleh melihat, hanya admin yang boleh menulis
drop policy if exists "produk publik" on public.products;
create policy "produk publik" on public.products for select using (true);
drop policy if exists "produk admin tulis" on public.products;
create policy "produk admin tulis" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "foto publik" on public.product_photos;
create policy "foto publik" on public.product_photos for select using (true);
drop policy if exists "foto admin tulis" on public.product_photos;
create policy "foto admin tulis" on public.product_photos for all
  using (public.is_admin()) with check (public.is_admin());

-- sell_requests: customer membuat & melihat miliknya, admin melihat & mengubah semua
drop policy if exists "pengajuan buat sendiri" on public.sell_requests;
create policy "pengajuan buat sendiri" on public.sell_requests
  for insert with check (user_id = auth.uid() and status = 'baru');
drop policy if exists "pengajuan lihat" on public.sell_requests;
create policy "pengajuan lihat" on public.sell_requests
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "pengajuan admin ubah" on public.sell_requests;
create policy "pengajuan admin ubah" on public.sell_requests
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "pengajuan admin hapus" on public.sell_requests;
create policy "pengajuan admin hapus" on public.sell_requests
  for delete using (public.is_admin());

-- ---------- 5. Storage untuk foto produk ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('produk', 'produk', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "foto produk publik" on storage.objects;
create policy "foto produk publik" on storage.objects
  for select using (bucket_id = 'produk');
drop policy if exists "foto produk admin upload" on storage.objects;
create policy "foto produk admin upload" on storage.objects
  for insert with check (bucket_id = 'produk' and public.is_admin());
drop policy if exists "foto produk admin ubah" on storage.objects;
create policy "foto produk admin ubah" on storage.objects
  for update using (bucket_id = 'produk' and public.is_admin());
drop policy if exists "foto produk admin hapus" on storage.objects;
create policy "foto produk admin hapus" on storage.objects
  for delete using (bucket_id = 'produk' and public.is_admin());

-- =====================================================================
-- SETELAH mendaftar akun admin lewat website (/daftar), jadikan admin:
--   update public.profiles set role = 'admin' where no_hp = '6281234567890';
-- =====================================================================

-- ---------- 6. Testimonial / Ulasan pelanggan ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kota text not null,
  pesan text not null,
  rating int not null default 5 check (rating between 1 and 5),
  aktif boolean not null default true,
  urutan int not null default 0,
  created_at timestamptz not null default now()
);

-- Semua orang boleh lihat, hanya admin yang bisa ubah
drop policy if exists "testimonial publik" on public.testimonials;
create policy "testimonial publik" on public.testimonials for select using (aktif = true);
drop policy if exists "testimonial admin" on public.testimonials;
create policy "testimonial admin" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
alter table public.testimonials enable row level security;

-- Seed testimonial awal (placeholder)
insert into public.testimonials (nama, kota, pesan, rating, urutan) values
  ('Budi Santoso', 'Bogor', 'Unit yang saya beli kondisinya sesuai foto, baterai masih 89%. Transaksi lancar lewat COD di toko. Recommended!', 5, 1),
  ('Siti Rahayu', 'Depok', 'Sudah 2x beli iPhone di JBIS, selalu puas. Harga bersaing, kondisi jujur, pelayanan ramah.', 5, 2),
  ('Andi Wijaya', 'Jakarta Selatan', 'Jual iPhone 13 Pro di sini prosesnya cepat. Dicek langsung di toko, deal hari itu juga. Bayarnya langsung transfer.', 5, 3)
on conflict do nothing;
