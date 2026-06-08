import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        404
      </p>
      <h1 className="font-serif text-4xl font-black text-slate-950">This page is outside the margin.</h1>
      <p className="mt-4 max-w-xl leading-7 text-slate-600">
        The page may have moved, or the note may not exist yet. Return to the archive and keep reading.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        Back to archive
      </Link>
    </main>
  );
}
