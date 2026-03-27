import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/contexts/LangContext";

export const metadata: Metadata = {
  title: "WaterCut – Remove Watermarks from Videos",
  description: "Remove, blur or pixelate watermarks from videos in your browser. No uploads, no servers, 100% private.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
