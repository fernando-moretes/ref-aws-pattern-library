"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PATTERNS, CATEGORY_LABELS, searchPatterns, type Category } from "../../lib/patterns";

const CATEGORIES = ["all", ...(Object.keys(CATEGORY_LABELS) as Category[])] as const;

export default function PatternsIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");

  const results = useMemo(() => searchPatterns(query, category), [query, category]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Patterns</h1>
      <p className="mt-2 max-w-3xl text-slate-400">
        {PATTERNS.length} reference architectures grouped by category. Filter, search by service
        name, or open one to see the diagram, ADR and cost notes.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tagline or AWS service…"
            className="w-full rounded-md border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : CATEGORY_LABELS[c as Category]}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <Link
            key={p.slug}
            href={`/patterns/${p.slug}`}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-500/60"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {CATEGORY_LABELS[p.category]}
            </p>
            <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{p.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              {p.services.slice(0, 5).map((s) => (
                <span key={s} className="rounded border border-slate-700 px-1.5 py-0.5">
                  {s}
                </span>
              ))}
              {p.services.length > 5 && (
                <span className="text-slate-500">+{p.services.length - 5}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
