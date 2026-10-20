"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#works", label: "Работы" },
  { href: "#about", label: "О мастере" },
  { href: "#order", label: "Заказать" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-espresso/5 bg-cream/80 py-3 shadow-sm backdrop-blur-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-tight text-espresso md:text-3xl"
        >
          Atelier <span className="text-rose">Vasilina</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-espresso/70 transition-colors hover:text-rose"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#order"
          className="rounded-full bg-espresso px-4 py-2 text-xs font-medium tracking-wide text-cream transition hover:bg-rose md:px-5 md:py-2.5 md:text-sm"
        >
          Связаться
        </a>
      </div>
    </motion.header>
  );
}
