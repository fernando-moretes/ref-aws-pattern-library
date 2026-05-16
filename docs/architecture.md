# Architecture

`aws-pattern-library` is a Next.js 16 application backed by a single source of
truth: [`frontend/lib/patterns.ts`](../frontend/lib/patterns.ts). All pages —
landing, index, detail, compare — derive from that module.

## Components

- **Frontend (Next.js 16, App Router):**
  - Server components for the landing and pattern detail pages (good for SEO
    and prerendering via `generateStaticParams`).
  - Client components for the searchable index and the compare page (need
    interactive state).
- **Mermaid renderer (`components/Mermaid.tsx`):** dynamically imports
  `mermaid` only when mounted to keep the initial bundle small.
- **CI/CD:** validate, build, scan, deploy.
- **Hosting:** Vercel; DNS via Cloudflare for `patterns.moretes.com`.

## Data model

Each pattern carries:

- Identity: `slug`, `title`, `tagline`, `category`.
- Architecture: `services`, `mermaid`.
- Decision: `context`, `decision`, `consequences`, `whenToUse`, `whenToAvoid`.
- Operations: `costEstimate`, `pillars`, optional `references`.

Adding a pattern is purely additive to the array; routes pick it up.

## Roadmap

1. Add deep-link to the AWS Architecture Studio's ADR wizard pre-filled from a
   pattern.
2. Add a "stack picker" wizard that asks 4-5 questions and shortlists patterns.
3. Expand to 50+ patterns covering serverless workflows, analytics, and data
   mesh.
4. Add per-pattern Terraform / CDK skeletons under `docs/patterns/<slug>/`.
