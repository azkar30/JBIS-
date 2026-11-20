"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, className = "btn-primary w-full py-2.5", pendingText = "Memproses..." }: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
