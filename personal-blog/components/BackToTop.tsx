"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}
