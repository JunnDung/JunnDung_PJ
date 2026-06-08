import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="font-serif text-xl font-black text-slate-950">
            Private Margins
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
            A personal editorial blog for essays, research notes, and reflective
            arguments about technology, culture, design, books, and philosophy.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Navigate</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-950">Home</Link></li>
            <li><Link href="/#essays" className="hover:text-slate-950">Essays</Link></li>
            <li><Link href="/#notes" className="hover:text-slate-950">Notes</Link></li>
            <li><Link href="/#about" className="hover:text-slate-950">About</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Social</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li><a href="mailto:hello@example.com" className="hover:text-slate-950">Email</a></li>
            <li><a href="#" className="hover:text-slate-950">Twitter/X</a></li>
            <li><a href="#" className="hover:text-slate-950">LinkedIn</a></li>
            <li><a href="#" className="hover:text-slate-950">RSS</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 px-5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Private Margins. All rights reserved.
      </div>
    </footer>
  );
}
