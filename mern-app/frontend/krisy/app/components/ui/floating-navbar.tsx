"use client";
import React from "react";
import {
  motion,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/language-context";

export const FloatingNav = ({ className }: { className?: string }) => {
  const { t } = useLanguage();

  const navItems = [
    { name: t("home"), link: "/" },
    { name: t("dashboard"), link: "/dashboard" },
    { name: t("reports"), link: "/reports" },
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[5000]",
        className
      )}
    >
      <div className="flex items-center gap-10 rounded-full bg-[#eef6df] px-6 py-3 shadow-md border">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Krisy" className="h-8 w-8 rounded-full shadow-sm" />
          <span className="text-lg font-bold text-[#2f2a1e]">
            Krisy
          </span>
        </div>

        {/* CENTER: Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-sm font-semibold text-[#3b3b3b] hover:text-[#008000] transition"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* RIGHT: Get Started button */}
        <button className="rounded-full bg-[#008000] px-5 py-2 text-sm font-bold text-white hover:opacity-90 shadow-sm transition active:scale-95">
          {t("getStarted")}
        </button>
      </div>
    </motion.div>
  );
};
