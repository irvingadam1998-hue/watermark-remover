import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watermark Remover",
  description: "Elimina marcas de agua de tus videos con FFmpeg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-gray-950 text-white">{children}</body>
    </html>
  );
}
