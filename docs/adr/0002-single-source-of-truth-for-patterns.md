# 2. Patterns live in a single TypeScript module

- **Status:** accepted
- **Date:** 2026-05-15
- **Deciders:** Fernando Francisco Azevedo

## Context and Problem Statement

The library could store patterns as Markdown files, JSON, a database or
TypeScript. We want to balance authoring ergonomics, type safety and rendering
performance.

## Considered Alternatives

- **Markdown per pattern with frontmatter** — friendly to non-coders but
  requires a parser and loses TypeScript types.
- **JSON file** — simple, but no rich type checking on shape.
- **TypeScript module** (chosen).
- **CMS / database** — overkill for a static catalog.

## Decision

Patterns live in `frontend/lib/patterns.ts` as a typed array. Pages derive
everything from this module via pure functions (`findPattern`, `searchPatterns`).

## Consequences

- Authors get full TypeScript autocomplete and compile-time checks.
- Pattern detail pages prerender via `generateStaticParams` with no I/O.
- Non-developers cannot contribute patterns without touching code; this is an
  acceptable trade-off given the audience.
