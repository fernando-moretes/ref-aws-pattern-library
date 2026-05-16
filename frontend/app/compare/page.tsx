"use client";

import { useState } from "react";
import { PATTERNS, findPattern, CATEGORY_LABELS } from "../../lib/patterns";
import Mermaid from "../../components/Mermaid";

export default function ComparePage() {
  const [a, setA] = useState(PATTERNS[0].slug);
  const [b, setB] = useState(PATTERNS[1].slug);

  const pa = findPattern(a)!;
  const pb = findPattern(b)!;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Compare patterns</h1>
      <p className="mt-2 max-w-3xl text-slate-400">
        Side-by-side comparison of two reference architectures. Useful when picking between
        candidates during a design review.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <select
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          {PATTERNS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
        <select
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          {PATTERNS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {[pa, pb].map((p, i) => (
          <article key={i} className="space-y-4">
            <header>
              <p className="text-xs uppercase tracking-wider text-cyan-300">
                {CATEGORY_LABELS[p.category]}
              </p>
              <h2 className="mt-1 text-xl font-bold">{p.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
            </header>
            <Mermaid chart={p.mermaid} />
            <Block title="When to use">
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {p.whenToUse.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </Block>
            <Block title="When to avoid">
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {p.whenToAvoid.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </Block>
            <Block title="Decision">
              <p className="text-sm text-slate-300">{p.decision}</p>
            </Block>
            <Block title="Cost estimate">
              <p className="text-sm text-slate-300">{p.costEstimate}</p>
            </Block>
            <Block title="Services">
              <ul className="flex flex-wrap gap-1.5 text-xs">
                {p.services.map((s) => (
                  <li key={s} className="rounded border border-slate-700 px-2 py-1 text-slate-300">
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
          </article>
        ))}
      </div>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
