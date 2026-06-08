import { notFound } from "next/navigation";
import AdminArticleForm from "@/components/AdminArticleForm";
import { prisma } from "@/lib/prisma";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { tags: true }
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Edit article</p>
        <h2 className="font-serif text-3xl font-bold text-slate-950">{article.title}</h2>
      </div>
      <AdminArticleForm article={article} />
    </div>
  );
}
