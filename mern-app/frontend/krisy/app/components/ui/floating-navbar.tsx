"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Dashboard", link: "/dashboard" },
  { name: "Reports", link: "/reports" },
];

export const FloatingNav = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - (scrollYProgress.getPrevious() ?? 0);
      setVisible(direction < 0 || scrollYProgress.get() < 0.05);
    }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-[5000]",
          className
        )}
      >
        <div className="flex items-center gap-10 rounded-full bg-[#eef6df] px-6 py-3 shadow-md border">

          {/* LEFT: Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Krisy" className="h-8 w-8" />
            <span className="text-lg font-semibold text-[#2f2a1e]">
              Krisy
            </span>
          </div>

          {/* CENTER: Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="text-sm text-[#3b3b3b] hover:text-black transition"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* RIGHT: Get Started button */}
          <button className="rounded-full bg-[#008000] px-5 py-2 text-sm font-medium text-[#4b2e1e] hover:opacity-90 transition">
            Get Started
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
