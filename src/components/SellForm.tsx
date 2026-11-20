"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import Alert from "./Alert";
import { kirimPengajuan } from "@/app/actions/jual";
import { KAPASITAS, KELENGKAPAN, KONDISI, MODEL_IPHONE, TIPE } from "@/lib/config";

export default function SellForm({ nama, noHp }: { nama: string; noHp: string }) {
  const [state, action, pending] = useActionState(kirimPengajuan, undefined);
  const [kondisi, setKondisi] = useState("");
  const [harga, setHarga] = useState("");

  // Setelah tersimpan, langsung buka WhatsApp dengan template pesan
  useEffect(() => {
    if (state?.waUrl) window.location.href = state.waUrl;
  }, [state]);

  if (state?.waUrl) {
    return (
      <div className="card p-8 text-center border-emerald-500/40 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
        <h2 className="text-xl font-bold text-white">Pengajuan tersimpan ✓</h2>
        <p className="mt-2 text-neutral-300">
          Kamu sedang diarahkan ke WhatsApp JBIS. Kirim pesannya, lalu admin akan membalas untuk jadwal cek fisik.
        </p>
        <a href={state.waUrl} className="btn-primary mt-6" target="_blank" rel="noopener noreferrer">
          Buka WhatsApp
        </a>
      </div>
    );
  }

  return (
    // onSubmit (bukan action=) agar isian form tidak direset React jika ada error validasi
    <form className="space-y-6" onSubmit={(e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      startTransition(() => action(data));
    }}>
      {state?.error && <Alert>{state.error}</Alert>}

      <fieldset className="card p-6 space-y-4">
        <legend className="sr-only">Data diri</legend>
        <h2 className="font-bold text-white text-base">1. Data diri</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label" htmlFor="nama">Nama</label>
            <input className="input" id="nama" name="nama" defaultValue={nama} required />
          </div>
          <div>
            <label className="label" htmlFor="no_hp">Nomor HP / WA</label>
            <input className="input" id="no_hp" name="no_hp" defaultValue={noHp} inputMode="tel" required />
          </div>
          <div>
            <label className="label" htmlFor="domisili">Domisili</label>
            <input className="input" id="domisili" name="domisili" placeholder="Contoh: Cibinong" required />
          </div>
        </div>
      </fieldset>

      <fieldset className="card p-6 space-y-4">
        <legend className="sr-only">Spesifikasi</legend>
        <h2 className="font-bold text-white text-base">2. Spesifikasi iPhone</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="model">Model</label>
            <select className="input" id="model" name="model" required defaultValue="">
              <option value="" disabled className="bg-neutral-900 text-neutral-500">Pilih model</option>
              {MODEL_IPHONE.map((m) => (
                <option key={m} value={m} className="bg-neutral-900 text-white">{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="kapasitas">Kapasitas</label>
            <select className="input" id="kapasitas" name="kapasitas" required defaultValue="">
              <option value="" disabled className="bg-neutral-900 text-neutral-500">Pilih kapasitas</option>
              {KAPASITAS.map((k) => (
                <option key={k} value={k} className="bg-neutral-900 text-white">{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="warna">Warna</label>
            <input className="input" id="warna" name="warna" placeholder="Contoh: Silver" required />
          </div>
          <div>
            <label className="label" htmlFor="tipe">Tipe</label>
            <select className="input" id="tipe" name="tipe" required defaultValue="">
              <option value="" disabled className="bg-neutral-900 text-neutral-500">Pilih tipe</option>
              {TIPE.map((t) => (
                <option key={t} value={t} className="bg-neutral-900 text-white">{t}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="card p-6 space-y-4">
        <legend className="sr-only">Kondisi</legend>
        <h2 className="font-bold text-white text-base">3. Kondisi</h2>
        <div className="sm:w-1/2">
          <label className="label" htmlFor="battery_health">Battery health (%)</label>
          <input className="input" type="number" id="battery_health" name="battery_health" min={1} max={100} placeholder="Contoh: 85" required />
        </div>
        <div>
          <span className="label">Kondisi fisik & fungsi</span>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {KONDISI.map((k) => (
              <label
                key={k.value}
                className="flex gap-3 rounded-xl border border-neutral-800 bg-black/60 px-3.5 py-3 text-sm cursor-pointer transition-all has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-950/20 has-[:checked]:shadow-[0_0_15px_rgba(0,255,136,0.15)]"
              >
                <input type="radio" name="kondisi" value={k.value} required onChange={() => setKondisi(k.value)} className="mt-0.5 accent-emerald-400" />
                <span>
                  <span className="font-semibold text-white">{k.value}</span>
                  <span className="block text-xs text-neutral-400 mt-0.5">{k.info}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="catatan_kondisi">Catatan kondisi {kondisi === "Ada Minus" ? "(wajib)" : "(opsional)"}</label>
          <textarea className="input" id="catatan_kondisi" name="catatan_kondisi" rows={2} required={kondisi === "Ada Minus"}
            placeholder="Contoh: Face ID tidak berfungsi, ada retak halus di pojok layar" />
        </div>
        <div>
          <span className="label">Kelengkapan</span>
          <div className="flex flex-wrap gap-2.5">
            {KELENGKAPAN.map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-black/60 px-3.5 py-2 text-sm cursor-pointer transition-all has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-950/20 has-[:checked]:shadow-[0_0_12px_rgba(0,255,136,0.15)] text-neutral-200"
              >
                <input type="checkbox" name="kelengkapan" value={k} className="accent-emerald-400" /> {k}
              </label>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">Kosongkan jika hanya unit saja.</p>
        </div>
      </fieldset>

      <fieldset className="card p-6 space-y-4">
        <legend className="sr-only">Harga</legend>
        <h2 className="font-bold text-white text-base">4. Harga jual</h2>
        <div className="sm:w-1/2">
          <label className="label" htmlFor="harga_jual">Harga yang kamu inginkan</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">Rp</span>
            <input className="input pl-10" id="harga_jual" name="harga_jual" inputMode="numeric" required value={harga}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "");
                setHarga(d ? Number(d).toLocaleString("id-ID") : "");
              }} placeholder="7.500.000" />
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">Harga final ditentukan setelah cek fisik bersama admin.</p>
        </div>
      </fieldset>

      <button className="btn-primary w-full py-3.5 text-base" disabled={pending}>
        {pending ? "Menyimpan..." : "Kirim & lanjut ke WhatsApp"}
      </button>
    </form>
  );
}
