"use client";

import { FormEvent, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailPattern.test(email)) {
      setStatus("error");
      return;
    }

    const subscribers = JSON.parse(window.localStorage.getItem("private-margins-subscribers") ?? "[]") as string[];
    const next = Array.from(new Set([...subscribers, email.toLowerCase()]));
    window.localStorage.setItem("private-margins-subscribers", JSON.stringify(next));
    setStatus("success");
    setEmail("");
  }

  return (
    <section
      id="subscribe"
      className="rounded-3xl border border-slate-300 bg-white px-6 py-10 shadow-sm sm:px-10"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Newsletter
        </p>
        <h2 className="font-serif text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
          Join the private notes
        </h2>
        <p className="mt-4 leading-7 text-slate-600">
          Receive new essays, research fragments, reading notes, and quiet
          arguments about technology, culture, books, and attention.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus("idle");
            }}
            placeholder="you@example.com"
            aria-invalid={status === "error"}
            aria-describedby="subscribe-status"
            className="min-h-12 flex-1 rounded-full border border-slate-300 bg-[#f9f9f9] px-5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
          />
          <button
            type="submit"
            className="min-h-12 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Subscribe
          </button>
        </form>

        <p id="subscribe-status" className="mt-4 text-xs text-slate-500" aria-live="polite">
          {status === "success" && "You are on the private notes list."}
          {status === "error" && "Enter a valid email address."}
          {status === "idle" && "No spam. Just thoughtful writing."}
        </p>
      </div>
    </section>
  );
}
