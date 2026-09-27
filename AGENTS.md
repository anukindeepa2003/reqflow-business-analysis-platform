# ReqFlow Repository Guidance

These instructions apply to all work in this repository, including future Codex sessions.

## Phase boundary

- Work only within the phase or task explicitly assigned by the user.
- Do not begin the next phase, implement adjacent product features, or widen scope without explicit approval.
- Clearly distinguish implemented, planned, simulated, and blocked work.
- Never fabricate test results, stakeholder approval, interviews, metrics, screenshots, deployment outcomes, or business impact.

## Architecture boundaries

- Keep `apps/web` responsible for presentation, interaction, and API consumption.
- Keep `apps/api` responsible for validation, business rules, persistence orchestration, and HTTP contracts.
- Follow the API flow: routes -> validation -> controllers -> services -> Prisma -> PostgreSQL.
- Controllers should translate HTTP input/output; keep reusable business rules in services.
- Do not import frontend code into the API or API implementation modules into the frontend.
- Use REST JSON endpoints under `/api`. Keep response/error shapes consistent.
- Do not add a framework, dependency, or abstraction without a concrete requirement and a short rationale.

## Coding conventions

- Use TypeScript with the repository's strict settings. Do not weaken compiler options to silence errors.
- Prefer small, named functions and explicit domain types over clever or implicit code.
- Use ES modules and include `.js` extensions in relative API imports compiled with NodeNext.
- Use semantic HTML, keyboard-accessible controls, visible focus states, and accessible contrast.
- Keep components focused; extract shared UI only when reuse or clarity justifies it.
- Use environment variables for configuration. Never commit `.env`, credentials, tokens, or real client data.
- Store and compare timestamps as UTC; localize only at the presentation boundary.

## Validation and data integrity

- Treat all request path, query, body, header, and external data as untrusted.
- Define Zod schemas at the API validation boundary and use parsed values downstream.
- Frontend validation improves usability but never replaces server validation.
- Enforce foreign keys, uniqueness, and nullability in PostgreSQL where supported.
- Requirements and linked test cases must belong to the same project; enforce this in the service transaction and add database protection where the final schema supports it.
- A requirement update and its change-history records must commit or roll back together.
- Use persistent UUID primary keys. Human-readable identifiers must be stable and derived from persisted allocation, not row position or current count.

## Security guidelines

- The current MVP is unauthenticated and local-only. Do not expose it as a publicly writable service.
- Do not imply that a workflow status is a real stakeholder approval.
- Limit JSON/body sizes, avoid leaking stack traces, and return safe client errors.
- Use parameterized Prisma operations rather than building SQL strings. Review any raw query explicitly.
- Validate CORS configuration and production environment variables before any deployment work.
- Avoid logging secrets, full sensitive payloads, or database URLs.

## Testing expectations

- Add or update tests with each behavior change.
- Prefer service tests for business rules and Supertest integration tests for HTTP contracts.
- Use Playwright only in a later approved phase for valuable end-to-end user journeys.
- Before reporting completion, run the relevant type checks, tests, builds, and Prisma validation.
- Report exact commands and outcomes. If a tool, service, or permission blocks a check, name the blocker and do not mark the check as passed.
- Do not replace meaningful tests with snapshots that hide behavior.

## Documentation rules

- Update BA, architecture, API, database, setup, and status documentation in the same change when behavior or decisions change.
- Preserve the statement that Apex Digital Solutions and its stakeholders are fictional and simulated.
- Do not claim a feature is complete until implementation and relevant verification exist.
- Record important decisions and unresolved questions; do not silently invent stakeholder choices.
- Keep `README.md` commands and implementation status accurate.

## Change reporting

At handoff, report:

1. What changed and why.
2. Important files added or modified.
3. Verification commands actually run and their results.
4. Known issues, assumptions, or blocked checks.
5. Any decision the user should understand before the next phase.

Keep unrelated user changes intact. Review existing files before editing, and do not use destructive Git operations unless explicitly authorized.
