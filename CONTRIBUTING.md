# Contributing

This repository follows GitFlow and Conventional Commits.

## Branch strategy

- `main`: stable, portfolio-ready releases.
- `develop`: integration branch.
- `feat/*`: new implementation.
- `docs/*`: documentation and architecture artifacts.
- `ci/*`: pipelines and automation.
- `fix/*`: corrections.
- `hotfix/*`: urgent corrections against `main`.

## Conventional Commits

Examples:

- `feat(api): add ADR generator endpoint`
- `fix(ui): handle empty cost input`
- `docs(adr): record decision on FinOps tagging`
- `ci(vercel): add production deploy gate`

## Pull request checklist

- [ ] The PR has a clear architecture or implementation purpose.
- [ ] Documentation was updated.
- [ ] Tests pass locally.
- [ ] Security and cost implications were considered.
- [ ] ADRs were added for meaningful decisions.
