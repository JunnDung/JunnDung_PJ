"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PostActionsProps = {
  title: string;
  url: string;
  slug: string;
  articleId: string;
  isBookmarked: boolean;
  isAuthenticated: boolean;
};

export default function PostActions({ title, url, slug, articleId, isBookmarked, isAuthenticated }: PostActionsProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function toggleBookmark() {
    if (!isAuthenticated) {
      router.push(`/login?next=/posts/${slug}`);
      return;
    }

    setLoading(true);
    const next = !bookmarked;
    setBookmarked(next);

    const response = await fetch(`/api/bookmarks/${articleId}`, {
      method: next ? "POST" : "DELETE"
    });

    setLoading(false);

    if (!response.ok) {
      setBookmarked(!next);
      flash("Bookmark failed");
      return;
    }

    flash(next ? "Saved for later" : "Bookmark removed");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="font-serif text-lg font-bold text-slate-900">Article actions</p>
      <div className="mt-4 grid gap-2">
        <button type="button" onClick={copyLink} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400">Copy link</button>
        <button type="button" onClick={sharePost} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400">Share</button>
        <button type="button" onClick={toggleBookmark} disabled={loading} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60">
          {bookmarked ? "Saved" : "Save for later"}
        </button>
      </div>
      {status && <p className="mt-3 text-center text-xs font-medium text-slate-500">{status}</p>}
    </div>
  );
}
