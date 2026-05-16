# Operations

## Branching

Use GitFlow-style branches:

- `main` holds released portfolio versions.
- `develop` receives integrated work.
- `feature/*`, `fix/*`, and `hotfix/*` branches are merged through pull requests.

## Required checks

The repository includes automated checks for:

- Repository validation (required files, workflow YAML).
- Next.js lint and build.
- CodeQL for JavaScript / TypeScript.
- Trivy filesystem vulnerability scanning.
- Gitleaks secret scanning.
- Dependency review on pull requests.

## Vercel deployment

The frontend is in `frontend/` and builds with `next build`.

Configure these GitHub Actions secrets to enable real Vercel deployments:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Without those secrets, the Vercel workflow stays green and reports a skip notice.

## Cloudflare subdomain

The production URL is served from a `*.moretes.com` subdomain via Cloudflare DNS,
pointing to Vercel (CNAME `cname.vercel-dns.com`). See `SETUP.md` for details.
