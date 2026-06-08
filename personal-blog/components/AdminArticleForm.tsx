import { ArticleStatus, type Article, type Tag } from "@prisma/client";
import { createArticle, updateArticle } from "@/app/admin/articles/actions";

type ArticleWithTags = Article & { tags: Tag[] };

type AdminArticleFormProps = {
  article?: ArticleWithTags;
};

const defaultSections = [
  {
    id: "introduction",
    title: "Introduction",
    paragraphs: ["Write opening argument here."]
  },
  {
    id: "main-argument",
    title: "Main Argument",
    paragraphs: ["Develop central claim here."]
  },
  {
    id: "conclusion",
    title: "Conclusion",
    paragraphs: ["Close with a thoughtful synthesis."]
  }
];

export default function AdminArticleForm({ article }: AdminArticleFormProps) {
  const action = article ? updateArticle.bind(null, article.id) : createArticle;
  const tags = article?.tags.map((tag) => tag.name).join(", ") ?? "Essays, Ideas";
  const sections = JSON.stringify(article?.sections ?? defaultSections, null, 2);
  const publishedAt = article?.publishedAt ? article.publishedAt.toISOString().slice(0, 10) : "";

  return (
    <form action={action} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Title
          <input name="title" defaultValue={article?.title} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Slug
          <input name="slug" defaultValue={article?.slug} placeholder="my-essay-slug" className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">Excerpt
        <textarea name="excerpt" defaultValue={article?.excerpt} required rows={3} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Category
          <input name="category" defaultValue={article?.category ?? "Essays"} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Read time
          <input name="readTime" defaultValue={article?.readTime ?? "5 min read"} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Status
          <select name="status" defaultValue={article?.status ?? ArticleStatus.DRAFT} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Author
          <input name="author" defaultValue={article?.author ?? "Dũng Nguyễn Việt"} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Published date
          <input name="publishedAt" type="date" defaultValue={publishedAt} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">Author avatar URL
        <input name="authorAvatar" defaultValue={article?.authorAvatar ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">Cover image URL
        <input name="coverImage" defaultValue={article?.coverImage ?? "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop"} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">Tags comma-separated
        <input name="tags" defaultValue={tags} required className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-slate-300" />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">Sections JSON
        <textarea name="sections" defaultValue={sections} required rows={16} className="font-mono rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-slate-300" />
      </label>

      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input name="featured" type="checkbox" defaultChecked={article?.featured} className="h-4 w-4 rounded border-slate-300" />
        Featured article
      </label>

      <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
        {article ? "Save changes" : "Create article"}
      </button>
    </form>
  );
}
