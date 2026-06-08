import Link from "next/link";
import { archiveArticle } from "@/app/admin/articles/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: { tags: true }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl font-bold text-slate-950">Articles</h2>
        <Link href="/admin/articles/new" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">New article</Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Updated</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-5 py-4">
                  <p className="font-serif text-lg font-bold text-slate-950">{article.title}</p>
                  <p className="mt-1 text-xs text-slate-500">/{article.slug}</p>
                </td>
                <td className="px-5 py-4 text-slate-600">{article.status}{article.featured ? " · Featured" : ""}</td>
                <td className="px-5 py-4 text-slate-600">{article.category}</td>
                <td className="px-5 py-4 text-slate-500">{article.updatedAt.toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/posts/${article.slug}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400">View</Link>
                    <Link href={`/admin/articles/${article.id}/edit`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400">Edit</Link>
                    <form action={archiveArticle.bind(null, article.id)}>
                      <button type="submit" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400">Archive</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
