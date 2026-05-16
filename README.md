# AWS Pattern Library

A curated catalog of **22+ AWS reference architectures**. Each pattern ships
with a Mermaid diagram, an ADR (context, decision, consequences), the services
involved, Well-Architected pointers and cost notes — ready to copy into your
repos and pull requests.

![CI](https://github.com/fernandofatech/aws-pattern-library/actions/workflows/ci.yml/badge.svg)
![Frontend](https://github.com/fernandofatech/aws-pattern-library/actions/workflows/frontend.yml/badge.svg)
![Security](https://github.com/fernandofatech/aws-pattern-library/actions/workflows/security.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Live portfolio / Portfolio ao vivo

- **Production:** [AWS Pattern Library](https://patterns.moretes.com)
- **Documentation:** [Project docs](docs/architecture.md)
- **GitHub:** [fernandofatech/aws-pattern-library](https://github.com/fernandofatech/aws-pattern-library)
- **Author:** [Fernando Francisco Azevedo](https://fernando.moretes.com) · [LinkedIn](https://www.linkedin.com/in/fernando-francisco-azevedo/) · [GitHub](https://github.com/fernandofatech)

This public repository is part of a bilingual portfolio focused on solution
architecture, AWS, AI, MCP/tooling, DevSecOps, and production-ready engineering
practices.

Este repositório público faz parte de um portfólio bilíngue focado em
arquitetura de soluções, AWS, IA, MCP/tools, DevSecOps e boas práticas de
engenharia para produção.

## What it includes

22+ reference architectures across these categories:

- **Web** — three-tier app, static SPA, managed WordPress.
- **API** — serverless REST, managed GraphQL with AppSync.
- **Data** — data lake on S3, lakehouse with Iceberg.
- **Events** — event-driven microservices, Step Functions sagas, MSK streaming.
- **ML / AI** — real-time inference, batch inference, GenAI RAG with Bedrock.
- **IoT** — telemetry ingest at scale.
- **Security** — secrets rotation, GuardDuty + Security Hub posture.
- **DevOps** — blue/green deploys, EKS platform, CodePipeline CI/CD.
- **Hybrid / Networking** — multi-account VPC with Transit Gateway, cross-region DR.
- **Batch** — AWS Batch with EC2 Spot.

Each pattern provides:

- Mermaid `flowchart` diagram (renders client-side).
- Context / Decision / Consequences (ADR-shaped, MADR-friendly).
- Services involved (deep links from the catalog).
- Well-Architected pointers (Operational Excellence, Security, Reliability,
  Performance, Cost, Sustainability).
- Cost estimate with assumptions.

## Why this matters

A practicing solution architect spends hours rebuilding the same diagrams and
ADRs for the same recurring patterns. A versioned, searchable catalog removes
that friction and turns the team's experience into reusable assets — and gives
juniors a starting point that already encodes trade-offs.

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript 5
- Tailwind CSS 4
- Mermaid 11
- GitHub Actions (CI, Frontend, Vercel, Security)
- Deployed on Vercel · DNS via Cloudflare

## Routes

| Route | What it does |
|-------|--------------|
| `/` | Hero, category cards, recently added |
| `/patterns` | Search and filter the catalog |
| `/patterns/[slug]` | Pattern detail: diagram, ADR, pillars, cost |
| `/compare` | Side-by-side comparison of any two patterns |

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Operations

See [OPERATIONS.md](OPERATIONS.md) and [SETUP.md](SETUP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a new pattern is one entry in
[`frontend/lib/patterns.ts`](frontend/lib/patterns.ts) — every page picks it up
automatically.

## License

[MIT](LICENSE) — Copyright © 2026 Fernando Francisco Azevedo.
