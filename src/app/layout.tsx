import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "JBIS – Jual Beli iPhone Second", template: "%s – JBIS" },
  description: "Katalog iPhone second dengan kondisi jelas. Beli via Tokopedia, Shopee, COD, atau jual iPhone kamu ke JBIS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
