import Link from "next/link";
import { PATTERNS, CATEGORY_LABELS, type Category } from "../lib/patterns";

export default function Home() {
  const counts = PATTERNS.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-widest text-cyan-400">
        Portfolio · AWS Solution Architecture
      </p>
      <h1 className="text-4xl font-bold sm:text-6xl">AWS Pattern Library</h1>
      <p className="mt-6 max-w-3xl text-lg text-slate-300">
        A curated catalog of <strong>{PATTERNS.length} AWS reference architectures</strong>.
        Each pattern ships with a Mermaid diagram, an ADR (context, decision, consequences),
        the services involved, Well-Architected pointers and cost notes — ready to copy into
        your repos and PRs.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/patterns"
          className="rounded-md bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Browse all patterns
        </Link>
        <Link
          href="/compare"
          className="rounded-md border border-slate-600 px-5 py-2.5 font-semibold text-slate-200 hover:bg-slate-800"
        >
          Compare two patterns
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Browse by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <Link
              key={c}
              href={`/patterns?category=${c}`}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-500/60"
            >
              <p className="text-sm font-semibold text-cyan-300">{CATEGORY_LABELS[c]}</p>
              <p className="mt-1 text-2xl font-bold">{counts[c] ?? 0}</p>
              <p className="mt-1 text-xs text-slate-400">patterns</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Recently added</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERNS.slice(0, 6).map((p) => (
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
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
