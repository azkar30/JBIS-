"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone, phoneToEmail, safeNext } from "@/lib/utils";
import type { FormState } from "@/lib/types";

export async function daftar(_: FormState, form: FormData): Promise<FormState> {
  const nama = String(form.get("nama") || "").trim();
  const hp = normalizePhone(String(form.get("no_hp") || ""));
  const password = String(form.get("password") || "");
  const password2 = String(form.get("password2") || "");

  if (nama.length < 2) return { error: "Nama wajib diisi." };
  if (!hp) return { error: "Nomor HP tidak valid. Contoh: 081234567890." };
  if (password.length < 8) return { error: "Password minimal 8 karakter." };
  if (password !== password2) return { error: "Konfirmasi password tidak sama." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: phoneToEmail(hp),
    password,
    options: { data: { nama, no_hp: hp } },
  });
  if (error) {
    return { error: /registered|exists/i.test(error.message) ? "Nomor HP sudah terdaftar. Silakan masuk." : "Pendaftaran gagal: " + error.message };
  }
  if (!data.session) {
    return { error: "Akun dibuat, tetapi konfirmasi email di Supabase masih aktif. Matikan 'Confirm email' (lihat README)." };
  }
  revalidatePath("/", "layout");
  redirect(safeNext(String(form.get("next") || ""), "/katalog"));
}

export async function masuk(_: FormState, form: FormData): Promise<FormState> {
  const hp = normalizePhone(String(form.get("no_hp") || ""));
  const password = String(form.get("password") || "");
  if (!hp || !password) return { error: "Isi nomor HP dan password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: phoneToEmail(hp), password });
  if (error) return { error: "Nomor HP atau password salah." };
  revalidatePath("/", "layout");
  redirect(safeNext(String(form.get("next") || ""), "/katalog"));
}

export async function masukAdmin(_: FormState, form: FormData): Promise<FormState> {
  const hp = normalizePhone(String(form.get("no_hp") || ""));
  if (!hp) return { error: "Isi nomor HP." };

  const email = phoneToEmail(hp);
  const adminClient = createAdminClient();

  // Find user in Supabase Auth via admin API
  const { data: listData, error: listError } = await adminClient.auth.admin.listUsers();
  if (listError) return { error: "Gagal mengakses sistem auth: " + listError.message };

  const user = listData.users.find((u) => u.email === email);
  if (!user) return { error: "Nomor HP tidak ditemukan di sistem." };

  // Check admin role in profiles table
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Akun ini bukan akun admin." };

  // Generate a magic link to get a valid OTP token (server-side, never sent to user)
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !linkData?.properties) {
    return { error: "Gagal membuat sesi login: " + (linkError?.message ?? "unknown error") };
  }

  const { email_otp, hashed_token } = linkData.properties;

  // Verify OTP to establish a real session via the SSR client
  let sessionError: string | null = null;

  if (email_otp) {
    const { error: otpError } = await supabase.auth.verifyOtp({ email, token: email_otp, type: "email" });
    if (!otpError) {
      revalidatePath("/", "layout");
      redirect(safeNext(String(form.get("next") || ""), "/admin"));
    }
    sessionError = otpError.message;
  }

  // Fallback: try hashed_token
  if (hashed_token) {
    const { error: hashError } = await supabase.auth.verifyOtp({ email, token: hashed_token, type: "email" });
    if (!hashError) {
      revalidatePath("/", "layout");
      redirect(safeNext(String(form.get("next") || ""), "/admin"));
    }
    sessionError = hashError.message;
  }

  return { error: "Gagal membuat sesi login: " + (sessionError ?? "token tidak tersedia") };
}

export async function keluar() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
