import type { Metadata } from "next";
import "./globals.css";
import { FloatingNav } from "@/app/components/ui/floating-navbar";
import { LanguageProvider } from "@/app/context/language-context";
import { LanguageSelector } from "@/app/components/ui/language-selector";
import { Assistant } from "@/app/components/ui/assistant";

export const metadata: Metadata = {
  title: "Krisy",
  description: "Krisy - The AI Guide for Kishan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <FloatingNav />
          {children}
          <LanguageSelector />
          <Assistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
