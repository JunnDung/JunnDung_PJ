"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "sepia" | "dark";
type Size = "small" | "medium" | "large";
type Width = "focused" | "comfortable" | "wide";

type Preferences = {
  theme: Theme;
  size: Size;
  width: Width;
};

const STORAGE_KEY = "private-margins-reading-preferences";

const defaults: Preferences = {
  theme: "light",
  size: "medium",
  width: "comfortable"
};

const sizes: Record<Size, { fontSize: string; lineHeight: string }> = {
  small: { fontSize: "1rem", lineHeight: "1.8" },
  medium: { fontSize: "1.0625rem", lineHeight: "1.9" },
  large: { fontSize: "1.18rem", lineHeight: "2" }
};

const widths: Record<Width, string> = {
  focused: "640px",
  comfortable: "720px",
  wide: "820px"
};

function applyPreferences(preferences: Preferences) {
  const root = document.documentElement;
  root.dataset.theme = preferences.theme;
  root.style.setProperty("--reading-font-size", sizes[preferences.size].fontSize);
  root.style.setProperty("--reading-line-height", sizes[preferences.size].lineHeight);
  root.style.setProperty("--reading-width", widths[preferences.width]);
}

export default function ReadingPreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaults);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Preferences;
        setPreferences({ ...defaults, ...parsed });
        applyPreferences({ ...defaults, ...parsed });
        return;
      }
    } catch {
      setPreferences(defaults);
    }

    applyPreferences(defaults);
  }, []);

  function updatePreferences(next: Partial<Preferences>) {
    const updated = { ...preferences, ...next };
    setPreferences(updated);
    applyPreferences(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm shadow-sm backdrop-blur">
      <p className="font-serif text-lg font-bold text-slate-900">Reading settings</p>
      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {(["light", "sepia", "dark"] as Theme[]).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => updatePreferences({ theme })}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                  preferences.theme === theme
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Text</p>
          <div className="grid grid-cols-3 gap-2">
            {(["small", "medium", "large"] as Size[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updatePreferences({ size })}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                  preferences.size === size
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Width</p>
          <div className="grid grid-cols-3 gap-2">
            {(["focused", "comfortable", "wide"] as Width[]).map((width) => (
              <button
                key={width}
                type="button"
                onClick={() => updatePreferences({ width })}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                  preferences.width === width
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {width === "comfortable" ? "comfort" : width}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
