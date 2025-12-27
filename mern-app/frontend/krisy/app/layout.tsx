import type { Metadata } from "next";
import "./globals.css";
import { FloatingNav } from "@/app/components/ui/floating-navbar";
import { BackgroundRippleEffect } from "@/app/components/ui/background-ripple-effect";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect";
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
        <FloatingNav />
        <BackgroundRippleEffect />
        {children}
      </body>
    </html>
  );
}
