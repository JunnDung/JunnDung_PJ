import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [articles, published, drafts, subscribers, bookmarks] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.newsletterSubscriber.count(),
    prisma.bookmark.count()
  ]);

  const stats = [
    { label: "Articles", value: articles },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Subscribers", value: subscribers },
    { label: "Bookmarks", value: bookmarks }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-serif text-3xl font-black text-slate-950">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/articles" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="font-serif text-2xl font-bold text-slate-950">Manage articles</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Edit drafts, publish essays, and manage featured post.</p>
        </Link>
        <Link href="/admin/articles/new" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="font-serif text-2xl font-bold text-slate-950">Write new essay</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Create structured sections, tags, and metadata.</p>
        </Link>
        <Link href="/admin/newsletter" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="font-serif text-2xl font-bold text-slate-950">Newsletter</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Review subscribers stored in Postgres.</p>
        </Link>
      </div>
    </div>
  );
}
