import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Admin</p>
          <h1 className="font-serif text-4xl font-black text-slate-950">Editorial console</h1>
          <p className="mt-2 text-sm text-slate-500">Signed in as {user.email}</p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link href="/admin" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-400">Dashboard</Link>
          <Link href="/admin/articles" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-400">Articles</Link>
          <Link href="/admin/articles/new" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">New article</Link>
          <Link href="/admin/newsletter" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-400">Newsletter</Link>
        </nav>
      </div>
      {children}
    </main>
  );
}
