# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

`aws-pattern-library` is a Next.js application that catalogs 22+ AWS reference
architectures. Each pattern carries diagram, ADR, services, Well-Architected
pointers and cost notes. Hosted at `patterns.moretes.com`.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS 4
- Mermaid 11 (dynamically imported in `components/Mermaid.tsx`)
- GitHub Actions: CI, Frontend, Vercel, Security

## Development commands

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

## Repository layout

- `frontend/app/`
  - `page.tsx` — landing
  - `patterns/page.tsx` — searchable, filterable index (client component)
  - `patterns/[slug]/page.tsx` — detail (uses `generateStaticParams`)
  - `compare/page.tsx` — side-by-side comparison (client component)
- `frontend/lib/patterns.ts` — single source of truth for the catalog (`Pattern`,
  `PATTERNS`, `findPattern`, `searchPatterns`, `CATEGORY_LABELS`)
- `frontend/components/` — `Nav.tsx`, `Footer.tsx`, `Mermaid.tsx`
- `docs/` — architecture, ADRs, diagrams
- `.github/workflows/` — pipelines

## Adding a new pattern

Add an entry to `PATTERNS` in [`frontend/lib/patterns.ts`](frontend/lib/patterns.ts).
The index, search, compare and detail page all pick it up automatically (the
`[slug]` route uses `generateStaticParams`).

Required fields:

- `slug`, `title`, `tagline`, `category`
- `services` (string display names)
- `description`, `whenToUse`, `whenToAvoid`
- `mermaid` (a valid `flowchart LR` body)
- `context`, `decision`, `consequences` (ADR shape)
- `costEstimate`
- `pillars` (Well-Architected — at least one)

## Conventions

- All Mermaid charts use `flowchart LR` to render well at typical screen widths.
- Cost estimates always state the assumption (region, scale, time horizon).
- ADR text is written so it can be lifted directly into a `docs/adr/*.md` file.
