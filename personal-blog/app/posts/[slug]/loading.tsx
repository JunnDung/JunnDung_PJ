export default function PostLoading() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-5 text-center">
        <div className="mx-auto h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="mx-auto h-14 w-full animate-pulse rounded bg-slate-200" />
        <div className="mx-auto h-14 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="mt-12 aspect-[16/8] animate-pulse rounded-2xl bg-slate-200" />
      <div className="mx-auto mt-12 max-w-2xl space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-5 animate-pulse rounded bg-slate-200" />
        ))}
      </div>
    </main>
  );
}
