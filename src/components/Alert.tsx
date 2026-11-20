export default function Alert({ type = "error", children }: { type?: "error" | "success" | "info"; children: React.ReactNode }) {
  const cls = {
    error: "border-rose-500/40 bg-rose-950/40 text-rose-300",
    success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(0,255,136,0.15)]",
    info: "border-cyan-500/40 bg-cyan-950/40 text-cyan-300",
  }[type];
  return <div className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}
