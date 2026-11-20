import { STATUS_PENGAJUAN } from "@/lib/config";

export default function StatusBadge({ status }: { status: keyof typeof STATUS_PENGAJUAN }) {
  const s = STATUS_PENGAJUAN[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}
