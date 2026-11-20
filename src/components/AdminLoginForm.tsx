"use client";
import { useActionState } from "react";
import { useState } from "react";
import Alert from "./Alert";
import SubmitButton from "./SubmitButton";
import type { FormState } from "@/lib/types";

export default function AdminLoginForm({
  action,
  next = "",
}: {
  action: (s: FormState, f: FormData) => Promise<FormState>;
  next?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [hp, setHp] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <Alert>{state.error}</Alert>}
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="label" htmlFor="no_hp">
          Nomor HP Admin
        </label>
        <input
          className="input"
          id="no_hp"
          name="no_hp"
          inputMode="tel"
          placeholder="08xxxxxxxxxx"
          required
          autoComplete="tel"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>
      <SubmitButton>Masuk ke dashboard</SubmitButton>
    </form>
  );
}
