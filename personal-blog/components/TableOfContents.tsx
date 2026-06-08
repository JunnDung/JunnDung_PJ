"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  title: string;
};

type TableOfContentsProps = {
  items: TocItem[];
};

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5]
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-28" aria-label="Table of contents">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        Contents
      </p>
      <ol className="space-y-3 border-l border-slate-200 pl-4">
        {items.map((item) => {
          const active = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`text-sm transition ${
                  active
                    ? "font-semibold text-slate-950"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
