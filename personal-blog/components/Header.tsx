"use client";

import Link from "next/link";
import { useState } from "react";
import CommandPalette from "@/components/CommandPalette";
import type { Article } from "@/lib/article-types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#essays", label: "Essays" },
  { href: "/#notes", label: "Notes" },
  { href: "/#about", label: "About" },
  { href: "/#subscribe", label: "Subscribe" }
];

type HeaderProps = {
  articles: Article[];
};

export default function Header({ articles }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f9f9f9]/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        <Link href="/" className="font-serif text-xl font-black tracking-tight text-slate-950">
          Private Margins
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-4"
            >
              {link.label}
            </Link>
          ))}
          <CommandPalette articles={articles} />
          <Link
            href="/#subscribe"
            className="rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-4"
          >
            Subscribe
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          Menu
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-[#f9f9f9] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <CommandPalette articles={articles} />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
