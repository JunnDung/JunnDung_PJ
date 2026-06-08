import AdminArticleForm from "@/components/AdminArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">New article</p>
        <h2 className="font-serif text-3xl font-bold text-slate-950">Create essay</h2>
      </div>
      <AdminArticleForm />
    </div>
  );
}
