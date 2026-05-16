"use client";

import { useEffect, useRef, useState } from "react";

let initialized = false;

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            flowchart: { curve: "basis" },
          });
          initialized = true;
        }
        if (cancelled || !ref.current) return;
        const id = `m${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-md border border-red-900 bg-red-950/30 p-4 text-xs text-red-300">
        {error}
      </pre>
    );
  }
  return <div ref={ref} className="overflow-x-auto rounded-md border border-slate-800 bg-slate-900/40 p-4" />;
}
