# ReqFlow

**Requirements Management & Business Analysis Platform**

ReqFlow is a portfolio application for centrally organizing software projects, requirements, acceptance criteria, test cases, traceability, and basic project insight. The repository is being delivered in controlled phases; implementation currently extends through Phase 4 and is not yet the complete MVP.

## Fictional business context

The case study uses **Apex Digital Solutions**, a fictional software company. It assumes that requirements are currently distributed across spreadsheets, documents, and email, creating challenges with organization, change visibility, and traceability. These are simulated hypotheses—not results from real interviews, clients, surveys, deployments, or measured business outcomes.

## Planned MVP features

- Project management
- Requirement capture, classification, priority, and status
- Acceptance criteria
- Test case management
- Requirement-to-test-case traceability
- Search and filtering
- Basic statistics calculated from stored data
- Basic requirement change history

Authentication, multi-user collaboration, approval workflows, integrations, notifications, AI, and advanced analytics are explicitly outside the initial MVP.

## Technology stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Zod
- **Data:** PostgreSQL, Prisma
- **Testing:** Vitest, Supertest; Playwright is planned for a later phase
- **Development:** npm workspaces, Docker Compose, Git

## Project structure

```text
reqflow/
├── apps/
│   ├── api/                 Express API, Prisma config, API tests
│   └── web/                 React application
├── docs/
│   ├── architecture/        Technical decisions and data design
│   ├── business-analysis/   Simulated BA artifacts
│   └── testing/             Test strategy and evidence
├── tests/
│   ├── e2e/                 Reserved for later Playwright tests
│   └── screenshots/         Reserved for verified UI evidence
├── .env.example
├── AGENTS.md
├── docker-compose.yml
├── package.json
└── tsconfig.base.json
```

## Prerequisites

- Node.js 20.19 or newer
- npm 10 or newer
- Docker Desktop or another Docker Compose installation for PostgreSQL
- Git

Node.js 24 is supported by the selected dependencies. Docker PostgreSQL is required for Project management and its integration tests; the health endpoint remains database-independent.

## Installation

1. Clone the repository and enter its directory.
2. Copy `.env.example` to `.env` and change local values if needed. Never commit `.env`.
3. Install the exact dependency tree:

   ```bash
   npm ci
   ```

   Use `npm install` only when intentionally updating dependencies and the committed `package-lock.json`.

4. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

5. Generate the Prisma client and apply the committed migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate:deploy
   ```

## Run the application

Start the frontend and backend together:

```bash
npm run dev
```

Open `http://localhost:5173`. The API listens locally on `http://127.0.0.1:3002`, and `GET http://127.0.0.1:3002/api/health` returns its health status. The non-default API port avoids conflicts with other common local development servers; Vite reads `API_PORT` from `.env` for its `/api` proxy.

Run the apps separately when debugging:

```bash
npm run dev:web
npm run dev:api
```

Build and run the compiled API:

```bash
npm run build
npm run start --workspace @reqflow/api
```

## Tests and quality checks

```bash
npm run typecheck
npm test
npm run build
npm run prisma:validate
```

The current automated suite checks the API health contract plus the PostgreSQL-backed Project, Requirement, and Acceptance Criterion lifecycles with Vitest and Supertest. End-to-end Playwright coverage is planned for a later phase with broader user journeys.

## Current implementation status

Implemented through Phase 4:

- npm-workspaces monorepo with strict shared TypeScript rules
- Responsive React application shell with Dashboard, Projects, and Requirements routes
- Explicit in-development and honest empty states
- Live frontend check of `GET /api/health`
- Layered Express API foundation with environment validation and error handling
- Automated health endpoint test
- PostgreSQL Docker Compose configuration and Prisma scaffolding
- Initial BA, architecture, database, testing, and repository guidance
- PostgreSQL `projects` table with a reviewed Prisma migration
- Validated Project REST API for create, list, view, update, and delete
- Responsive Projects UI backed by persisted database records
- Database-backed Project API integration tests
- PostgreSQL Requirement model with project ownership and cascade deletion
- Stable project-scoped identifiers such as `REQ-0001` allocated transactionally
- Validated Requirement REST API for create, list, detail, update, and delete
- Project-scoped requirement search and type, MoSCoW-priority, and status filters
- Responsive Requirements UI and database-backed integration tests
- PostgreSQL Acceptance Criterion model owned by a Requirement with cascade deletion
- Stable requirement-scoped identifiers such as `AC-01` with persistent allocation
- Validated Acceptance Criteria REST API for create, list, update, delete, and ordering
- Responsive Acceptance Criteria UI with explicit up/down ordering controls
- Database-backed Acceptance Criteria integration tests

Not yet implemented:

- Test case, traceability-link, or change-history models and CRUD
- Traceability reporting and dashboard business statistics
- Authentication, authorization, deployment, or end-to-end tests

## Roadmap

1. **Phase 1 — Foundation:** application shell, health endpoint, infrastructure, documentation, and baseline tests.
2. **Phase 2 — Project management:** PostgreSQL Project model and migration, validated REST API, persisted Projects UI, and integration tests.
3. **Phase 3 — Requirement management:** project-owned requirements, stable readable IDs, classification, MoSCoW priority, lifecycle status, search/filtering, UI, and tests.
4. **Phase 4 — Acceptance criteria management:** requirement-owned criteria, stable readable IDs, explicit ordering, CRUD UI/API, integrity constraints, and tests.
5. **Later MVP phases:** incrementally add test cases, traceability, history, reports, and source-derived statistics.
6. **Future scope:** consider identity, collaboration, integrations, and production operations only after the MVP is validated.

No work proceeds beyond an explicitly approved phase.

## Screenshots

Pending. Screenshots will be added only after the relevant UI has been run and visually verified.

## AI assistance disclosure

AI assistance is used for architecture discussion, scaffolding, documentation drafts, implementation support, and test review. The human project owner remains responsible for understanding, validating, and explaining the design and code. AI-generated output is reviewed through type checks, builds, automated tests, and manual inspection; unexecuted tests or fictional evidence are never reported as fact.

## Security note

The MVP has no authentication. Run it on a trusted local development machine only, and do not expose it as a publicly writable service. Secrets belong in local environment variables, never in source control.
