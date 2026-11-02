# System Architecture

## Status and scope

This document describes the foundation plus the implemented Project- and Requirement-management slices through Phase 3. Components not yet implemented are labelled as planned.

## System context

ReqFlow is a local-first browser application. A React single-page application sends HTTP requests to an Express REST API. The Project and Requirement APIs use Prisma to access PostgreSQL; later domain modules will follow the same approved boundaries.

```text
Browser
  React + TypeScript + Tailwind CSS
          |
          | JSON over HTTP (/api/*)
          v
Node.js API
  Express routes -> validation -> controllers -> services -> Prisma
                                                        |
                                                        v
                                                PostgreSQL
```

The browser currently calls `GET /api/health`, Project endpoints under `/api/projects`, and project-scoped Requirement endpoints under `/api/projects/:projectId/requirements`. Project and Requirement records persist in PostgreSQL. Other domain modules remain planned.

## Monorepo components

### `apps/web` — frontend

Responsibilities:

- Render the application shell and route-level views.
- Provide accessible, responsive user interactions.
- Call REST endpoints and present loading, success, empty, and error states.
- Perform user-experience validation while treating the API as the authority.
- Avoid embedding business rules that must remain consistent across clients.

Vite provides the development server and production bundle. Its development proxy forwards `/api` calls to the local API, which avoids hard-coding a second origin in UI code.

### `apps/api` — backend

Responsibilities:

- Expose versioned domain behavior through REST-style HTTP endpoints.
- Validate untrusted input with Zod before business processing.
- Keep HTTP concerns in routes/controllers and domain orchestration in services.
- Use transactions for operations that must succeed or fail together.
- Enforce authorization if authentication is introduced in a future phase.
- Return predictable status codes and error shapes.

The intended request path is:

1. **Route:** maps an HTTP method and path to a handler chain.
2. **Validation:** parses request parameters, query, and body using Zod.
3. **Controller:** translates HTTP input/output and calls a service.
4. **Service:** applies business rules and coordinates persistence.
5. **Prisma:** executes typed database operations.
6. **PostgreSQL:** stores relational data and enforces supported constraints.

The health endpoint has no request data to validate and no persistence requirement, so it uses route, controller, and service layers only. Project write and identifier routes use Zod validation before their controllers call the Project service and Prisma client.

### PostgreSQL — persistence

Responsibilities:

- Persist project, requirement, acceptance criterion, test case, traceability, and change records.
- Enforce primary keys, foreign keys, unique constraints, and supported relationship rules.
- Execute transactions atomically.
- Store timestamps consistently in UTC.

Docker Compose defines the local PostgreSQL 16 service. It has received reviewed migrations for Projects and Requirements, including relational constraints and indexes.

### Documentation and tests

- `docs/business-analysis` records problem framing and requirements without presenting simulations as evidence.
- `docs/architecture` records technical boundaries and decisions.
- `docs/testing` records testing strategy and future evidence.
- `apps/api/tests` contains API-level automated tests.
- `tests/e2e` is reserved for later Playwright tests.

## Communication flow

For the implemented create-requirement command:

1. The user submits a form in the browser.
2. The frontend performs helpful client-side checks and sends JSON to the API.
3. API middleware parses the request; the route's Zod schema rejects malformed or unexpected data.
4. The controller passes validated values and project identifier to the Requirement service.
5. A short Prisma transaction increments the Project's persistent counter and inserts the Requirement with its allocated sequence number.
6. PostgreSQL applies ownership, uniqueness, enum, nullability, length, and formatting constraints before committing both changes.
7. The API returns a stable JSON representation and appropriate HTTP status.
8. The frontend updates the view or presents a useful error.

## Why this architecture

- **Monorepo:** keeps frontend, backend, tests, and documentation versioned together while retaining clear app boundaries.
- **REST:** is straightforward to inspect, test, and explain; the MVP does not need the added flexibility of a query language.
- **Layered backend:** separates transport, validation, business policy, and persistence so each concern can change and be tested with less coupling.
- **PostgreSQL:** fits the strongly related domain and supports foreign keys and transactions.
- **Prisma:** provides typed data access and migration tooling while leaving integrity-critical constraints visible in the relational model.
- **Zod:** turns untrusted runtime input into validated, typed data; TypeScript types alone disappear at runtime.
- **Local-first single user:** reduces security and operations scope while the domain is learned. It is not a claim that authentication is unnecessary for deployment.

## Cross-cutting decisions

- Environment-specific configuration comes from environment variables; `.env` files and secrets are ignored by Git.
- The API disables the `X-Powered-By` header and applies an explicit browser origin.
- Strict TypeScript and automated tests are repository-wide quality gates.
- Database writes that combine a requirement update with a history entry must be atomic.
- Documentation must identify planned versus implemented behavior.
