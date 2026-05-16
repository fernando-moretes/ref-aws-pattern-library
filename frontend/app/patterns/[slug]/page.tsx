import Link from "next/link";
import { notFound } from "next/navigation";
import { PATTERNS, CATEGORY_LABELS, findPattern } from "../../../lib/patterns";
import Mermaid from "../../../components/Mermaid";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function PatternPage({ params }: Props) {
  const { slug } = await params;
  const p = findPattern(slug);
  if (!p) notFound();

  const adrMd = renderAdr(p);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/patterns" className="text-sm text-cyan-300 hover:underline">
        ← All patterns
      </Link>
      <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
        {CATEGORY_LABELS[p.category]}
      </p>
      <h1 className="mt-1 text-3xl font-bold">{p.title}</h1>
      <p className="mt-2 text-slate-300">{p.tagline}</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Diagram</h2>
        <div className="mt-3">
          <Mermaid chart={p.mermaid} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Description
        </h2>
        <p className="mt-2 text-slate-200">{p.description}</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="When to use">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {p.whenToUse.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Card>
        <Card title="When to avoid">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {p.whenToAvoid.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">ADR</h2>
        <div className="mt-3 space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-sm">
          <div>
            <p className="font-semibold text-slate-200">Context</p>
            <p className="mt-1 text-slate-300">{p.context}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">Decision</p>
            <p className="mt-1 text-slate-300">{p.decision}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-200">Consequences</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
              {p.consequences.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <details className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
          <summary className="cursor-pointer text-cyan-300">Show as MADR Markdown</summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-slate-200">{adrMd}</pre>
        </details>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Well-Architected pointers
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {Object.entries(p.pillars).map(([k, v]) =>
            v ? (
              <div
                key={k}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm"
              >
                <p className="font-semibold text-cyan-300">{pillarLabel(k)}</p>
                <p className="mt-1 text-slate-300">{v}</p>
              </div>
            ) : null,
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Services involved">
          <ul className="flex flex-wrap gap-1.5 text-xs">
            {p.services.map((s) => (
              <li key={s} className="rounded border border-slate-700 px-2 py-1 text-slate-300">
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Cost estimate">
          <p className="text-sm text-slate-300">{p.costEstimate}</p>
        </Card>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function pillarLabel(key: string): string {
  return (
    {
      operationalExcellence: "Operational Excellence",
      security: "Security",
      reliability: "Reliability",
      performance: "Performance Efficiency",
      cost: "Cost Optimization",
      sustainability: "Sustainability",
    }[key] ?? key
  );
}

function renderAdr(p: ReturnType<typeof findPattern>): string {
  if (!p) return "";
  const lines = [
    `# ADR — ${p.title}`,
    "",
    "- **Status:** accepted",
    "- **Category:** " + p.category,
    "",
    "## Context",
    "",
    p.context,
    "",
    "## Decision",
    "",
    p.decision,
    "",
    "## Consequences",
    "",
    ...p.consequences.map((c) => `- ${c}`),
    "",
    "## Cost estimate",
    "",
    p.costEstimate,
  ];
  return lines.join("\n");
}
