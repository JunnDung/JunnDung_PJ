export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-slate-200" />
        <div className="space-y-5">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="h-12 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
