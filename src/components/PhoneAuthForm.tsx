"use client";

import { useActionState, useState } from "react";
import Alert from "./Alert";
import SubmitButton from "./SubmitButton";
import type { FormState } from "@/lib/types";

type Props = {
  mode: "masuk" | "daftar";
  action: (s: FormState, f: FormData) => Promise<FormState>;
  next?: string;
  submitLabel: string;
};

// Form login / daftar dengan nomor HP + password
export default function PhoneAuthForm({ mode, action, next = "", submitLabel }: Props) {
  const [state, formAction] = useActionState(action, undefined);
  // dikontrol agar isian tidak hilang saat login/daftar gagal (React mereset form setelah action)
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <Alert>{state.error}</Alert>}
      <input type="hidden" name="next" value={next} />
      {mode === "daftar" && (
        <div>
          <label className="label" htmlFor="nama">Nama lengkap</label>
          <input className="input" id="nama" name="nama" required autoComplete="name" value={nama} onChange={(e) => setNama(e.target.value)} />
        </div>
      )}
      <div>
        <label className="label" htmlFor="no_hp">Nomor HP (WhatsApp)</label>
        <input className="input" id="no_hp" name="no_hp" inputMode="tel" placeholder="08xxxxxxxxxx" required autoComplete="tel" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <div className={mode === "daftar" ? "grid grid-cols-2 gap-3" : ""}>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input className="input" type="password" id="password" name="password" minLength={mode === "daftar" ? 8 : undefined} required
            autoComplete={mode === "daftar" ? "new-password" : "current-password"} />
        </div>
        {mode === "daftar" && (
          <div>
            <label className="label" htmlFor="password2">Ulangi password</label>
            <input className="input" type="password" id="password2" name="password2" minLength={8} required autoComplete="new-password" />
          </div>
        )}
      </div>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
