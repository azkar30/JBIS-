# JBIS Store — Website Jual Beli iPhone Second

Next.js 15 (App Router, TypeScript) + Supabase (Auth, Postgres, Storage) + Tailwind CSS 4.
Bisa dijalankan lokal dan di-deploy gratis ke Vercel.

## Fitur
**Customer:** daftar/masuk dengan nomor HP + password · katalog dengan filter · detail produk (galeri foto) ·
tombol **Beli** → Tokopedia / Shopee / COD (WhatsApp) / Ambil di toko (WhatsApp) · menu **Jual iPhone Saya**
(form → tersimpan di database → diarahkan ke WhatsApp dengan template pesan) · halaman Akun (riwayat pengajuan).

**Admin (`/admin`):** login khusus admin · dashboard · upload iPhone baru (min. 3 foto, dikompres otomatis) ·
edit produk (data, kondisi, harga, foto + urutan foto) · hapus produk · tandai terjual · kelola pengajuan jual
(status, catatan, "Jadikan produk" yang mengisi form otomatis).

## Setup langkah demi langkah

### 1. Buat project Supabase
1. Daftar di https://supabase.com → **New project** (region: Southeast Asia/Singapore).
2. Buka **SQL Editor → New query**, salin seluruh isi `supabase/schema.sql`, klik **Run**.
   Ini membuat tabel, Row Level Security, trigger profil, dan bucket foto `produk`.
   Opsional untuk demo: jalankan juga `supabase/seed.sql` (6 produk contoh).
3. Buka **Authentication → Sign In / Providers → Email**:
   - pastikan **Email** aktif,
   - **matikan "Confirm email"** (login memakai nomor HP, tidak ada email sungguhan yang dikirim).
4. Buka **Project Settings → API Keys**, salin **Project URL** dan **Publishable key** (atau legacy *anon public*).

### 2. Jalankan di komputer
```bash
npm install
cp .env.example .env.local     # lalu isi URL, anon key, nomor WA toko
npm run dev                    # buka http://localhost:3000
```

### 3. Buat akun admin
1. Daftar biasa di `http://localhost:3000/daftar` dengan nomor HP admin.
2. Di Supabase SQL Editor jalankan (ganti nomornya, format 62...):
   ```sql
   update public.profiles set role = 'admin' where no_hp = '6281234567890';
   ```
3. Login di `http://localhost:3000/admin/login`.

### 4. Deploy ke Vercel
1. Upload folder ini ke GitHub (file `.env.local` jangan ikut di-commit).
2. Di https://vercel.com → **Add New Project** → pilih repo.
3. Isi **Environment Variables** sama seperti `.env.local`, dengan `NEXT_PUBLIC_SITE_URL` = domain Vercel kamu.
4. Deploy.

## Keamanan
- **Row Level Security** di semua tabel: siapa pun bisa melihat produk, tetapi hanya admin yang bisa menambah,
  mengubah, dan menghapus produk/foto. Customer hanya bisa membuat dan melihat pengajuan jual miliknya sendiri.
- Role tidak bisa diubah lewat API (tidak ada policy update di `profiles`); admin hanya bisa dijadikan lewat SQL.
- Halaman `/admin/*` dicek di middleware **dan** setiap aksi admin dicek lagi di server.
- Hanya memakai *anon key*; *service role key* tidak dipakai sama sekali di aplikasi.
- Upload foto dibatasi JPG/PNG/WEBP, maks 5 MB, hanya ke bucket `produk`.

## Struktur folder
```
supabase/schema.sql          skema database + RLS + storage
src/middleware.ts            proteksi halaman (login & admin)
src/lib/                     config toko, helper, query, client Supabase
src/app/(site)/              halaman customer: beranda, katalog, produk, jual, akun, masuk, daftar
src/app/admin/login          login admin
src/app/admin/(panel)/       dashboard, produk, upload/edit produk, pengajuan
src/app/actions/             server actions (auth, jual, admin)
src/components/              komponen UI (BuyButton, SellForm, ProductForm, dll.)
```

Daftar model iPhone, kapasitas, tipe, kondisi, dan alamat toko bisa diubah di `src/lib/config.ts`.
