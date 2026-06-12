import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NutriTreino — Diário nutricional",
  description: "Registro de refeições por foto com estimativa de macros via IA.",
  appleWebApp: { capable: true, title: "NutriTreino", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#f9fafb] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
