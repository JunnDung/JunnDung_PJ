"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import TopicPills from "@/components/TopicPills";

type SortMode = "latest" | "readTime" | "title";

type SearchFilterPanelProps = {
  articles: Article[];
  topics: string[];
};

function readTimeValue(readTime: string) {
  const match = readTime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function SearchFilterPanel({ articles, topics }: SearchFilterPanelProps) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");
  const [sortMode, setSortMode] = useState<SortMode>("latest");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles
      .filter((article) => {
        const topicMatches =
          activeTopic === "All" ||
          article.category === activeTopic ||
          article.tags.some((tag) => tag.toLowerCase() === activeTopic.toLowerCase());

        if (!topicMatches) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return [article.title, article.excerpt, article.category, ...article.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortMode === "readTime") {
          return readTimeValue(a.readTime) - readTimeValue(b.readTime);
        }

        if (sortMode === "title") {
          return a.title.localeCompare(b.title);
        }

        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      });
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Library
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Search the private archive
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Filter essays, research notes, books, philosophy, design, and technology writing without leaving the page.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <label htmlFor="article-search" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Search
          </label>
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “attention”, “books”, “design”..."
            className="mt-2 min-h-11 w-full rounded-full border border-slate-300 bg-[#f9f9f9] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              aria-label="Sort articles"
            >
              <option value="latest">Latest first</option>
              <option value="readTime">Shortest first</option>
              <option value="title">Title A-Z</option>
            </select>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-500 transition hover:text-slate-950"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <TopicPills topics={topics} activeTopic={activeTopic} onTopicChange={setActiveTopic} />
      </div>

      <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
        <p>{filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"} found</p>
        <p className="hidden sm:block">Active: {activeTopic}</p>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <div key={article.id} className="reveal-up" style={{ animationDelay: `${Math.min(index * 45, 220)}ms` }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
          <h3 className="font-serif text-2xl font-bold text-slate-900">No essays found</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Try another keyword or clear filters to return to the full archive.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Reset archive
          </button>
        </div>
      )}
    </section>
  );
}
