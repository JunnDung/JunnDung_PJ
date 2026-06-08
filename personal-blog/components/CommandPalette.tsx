"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Article } from "@/lib/article-types";

type CommandPaletteProps = {
  articles: Article[];
};

export default function CommandPalette({ articles }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return articles.slice(0, 5);
    }

    return articles
      .filter((article) =>
        [article.title, article.excerpt, article.category, ...article.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      )
      .slice(0, 6);
  }, [articles, query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
      >
        Search <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">Ctrl K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/30 px-4 py-20 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 p-4">
              <label htmlFor="command-search" className="sr-only">Search archive</label>
              <input
                id="command-search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search essays, tags, ideas..."
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-lg text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Close search"
              >
                Close
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-3">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((article) => (
                    <Link
                      key={article.id}
                      href={`/posts/${article.slug}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl border border-transparent p-4 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{article.category}</p>
                        <p className="text-xs text-slate-400">{article.readTime}</p>
                      </div>
                      <h3 className="mt-2 font-serif text-lg font-bold text-slate-950">{article.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{article.excerpt}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="font-serif text-xl font-bold text-slate-900">No result</p>
                  <p className="mt-2 text-sm text-slate-500">Try another idea or tag.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-400">
              <span>Press Esc to close</span>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
