"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/article-types";
import ArticleCard from "@/components/ArticleCard";
import TopicPills from "@/components/TopicPills";

type SortMode = "latest" | "readTime" | "title";

type SearchFilterPanelProps = {
  articles: Article[];
  topics: string[];
};

export default function SearchFilterPanel({ articles, topics }: SearchFilterPanelProps) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [results, setResults] = useState(articles);
  const [total, setTotal] = useState(articles.length);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({
        q: query,
        topic: activeTopic,
        sort: sortMode,
        page: "1",
        pageSize: "50"
      });

      try {
        const response = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { items: Article[]; total: number };
        setResults(data.items);
        setTotal(data.total);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults(articles);
          setTotal(articles.length);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [activeTopic, articles, query, sortMode]);

  function clearFilters() {
    setQuery("");
    setActiveTopic("All");
    setSortMode("latest");
  }

  return (
    <section id="essays" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Library</p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Search the private archive</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Filter essays, research notes, books, philosophy, design, and technology writing from the database.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <label htmlFor="article-search" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search</label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “attention”, “books”, “design”..."
            className="mt-2 min-h-11 w-full rounded-full border border-slate-300 bg-[#f9f9f9] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300" aria-label="Sort articles">
              <option value="latest">Latest first</option>
              <option value="readTime">Shortest first</option>
              <option value="title">Title A-Z</option>
            </select>
            <button type="button" onClick={clearFilters} className="text-xs font-semibold text-slate-500 transition hover:text-slate-950">Clear</button>
          </div>
        </div>
      </div>

      <div className="mb-7"><TopicPills topics={topics} activeTopic={activeTopic} onTopicChange={setActiveTopic} /></div>

      <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
        <p>{loading ? "Searching..." : `${total} article${total === 1 ? "" : "s"} found`}</p>
        <p className="hidden sm:block">Active: {activeTopic}</p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((article, index) => (
            <div key={article.id} className="reveal-up" style={{ animationDelay: `${Math.min(index * 45, 220)}ms` }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
          <h3 className="font-serif text-2xl font-bold text-slate-900">No essays found</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Try another keyword or clear filters to return to the full archive.</p>
          <button type="button" onClick={clearFilters} className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">Reset archive</button>
        </div>
      )}
    </section>
  );
}
