"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        Something broke
      </p>
      <h1 className="font-serif text-4xl font-black text-slate-950">The page lost its thread.</h1>
      <p className="mt-4 max-w-xl leading-7 text-slate-600">
        A runtime error interrupted this reading session. Try again, or return home and continue from the archive.
      </p>
      {error.digest && <p className="mt-3 text-xs text-slate-400">Error digest: {error.digest}</p>}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </main>
  );
}
