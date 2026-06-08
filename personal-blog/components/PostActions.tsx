"use client";

import { useEffect, useState } from "react";

type PostActionsProps = {
  title: string;
  url: string;
  slug: string;
};

const STORAGE_KEY = "private-margins-bookmarks";

export default function PostActions({ title, url, slug }: PostActionsProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const bookmarks = stored ? (JSON.parse(stored) as string[]) : [];
    setBookmarked(bookmarks.includes(slug));
  }, [slug]);

  function flash(message: string) {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 1800);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    flash("Link copied");
  }

  async function sharePost() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await copyLink();
  }

  function toggleBookmark() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const bookmarks = stored ? (JSON.parse(stored) as string[]) : [];
    const next = bookmarks.includes(slug)
      ? bookmarks.filter((item) => item !== slug)
      : [...bookmarks, slug];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setBookmarked(next.includes(slug));
    flash(next.includes(slug) ? "Saved for later" : "Bookmark removed");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="font-serif text-lg font-bold text-slate-900">Article actions</p>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Copy link
        </button>
        <button
          type="button"
          onClick={sharePost}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Share
        </button>
        <button
          type="button"
          onClick={toggleBookmark}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          {bookmarked ? "Saved" : "Save for later"}
        </button>
      </div>
      {status && <p className="mt-3 text-center text-xs font-medium text-slate-500">{status}</p>}
    </div>
  );
}
