# ReqFlow

**Requirements Management & Business Analysis Platform**

ReqFlow is a portfolio application for centrally organizing software projects, requirements, acceptance criteria, test cases, traceability, and basic project insight. The repository is being delivered in controlled phases; the current implementation is the Phase 1 foundation, not a complete product.

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

Node.js 24 is supported by the selected dependencies. Docker is required only when work begins against PostgreSQL; the Phase 1 health endpoint does not query the database.

## Installation

1. Clone the repository and enter its directory.
2. Copy `.env.example` to `.env` and change local values if needed. Never commit `.env`.
3. Install the exact dependency tree:

   ```bash
   npm ci
   ```

   Use `npm install` only when intentionally updating dependencies and the committed `package-lock.json`.

4. When Docker is available, start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

5. After database models are introduced in a later phase, generate the Prisma client with `npm run prisma:generate` and apply the documented migration workflow. Phase 1 intentionally has no models or migration.

## Run the application

Start the frontend and backend together:

```bash
npm run dev
```

Open `http://localhost:5173`. The API listens on `http://localhost:3000`, and `GET http://localhost:3000/api/health` returns its health status.

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

The current automated suite checks the API health contract with Vitest and Supertest. End-to-end Playwright coverage is planned only when real user workflows exist.

## Current implementation status

Implemented in Phase 1:

- npm-workspaces monorepo with strict shared TypeScript rules
- Responsive React application shell with Dashboard, Projects, and Requirements routes
- Explicit in-development and honest empty states
- Live frontend check of `GET /api/health`
- Layered Express API foundation with environment validation and error handling
- Automated health endpoint test
- PostgreSQL Docker Compose configuration and Prisma scaffolding
- Initial BA, architecture, database, testing, and repository guidance

Not yet implemented:

- Database application models and migrations
- Project, requirement, acceptance criterion, test case, link, or history CRUD
- Search, filtering, and dashboard business statistics
- Authentication, authorization, deployment, or end-to-end tests

## Roadmap

1. **Phase 1 — Foundation:** application shell, health endpoint, infrastructure, documentation, and baseline tests.
2. **Phase 2 — To be approved:** refine the domain model and deliver the next explicitly assigned vertical slice with migrations, validation, services, UI, and tests.
3. **Later MVP phases:** incrementally add requirement detail, acceptance criteria, tests, traceability, search, history, and source-derived statistics.
4. **Future scope:** consider identity, collaboration, integrations, and production operations only after the MVP is validated.

No work proceeds beyond an explicitly approved phase.

## Screenshots

Pending. Screenshots will be added only after the relevant UI has been run and visually verified.

## AI assistance disclosure

AI assistance is used for architecture discussion, scaffolding, documentation drafts, implementation support, and test review. The human project owner remains responsible for understanding, validating, and explaining the design and code. AI-generated output is reviewed through type checks, builds, automated tests, and manual inspection; unexecuted tests or fictional evidence are never reported as fact.

## Security note

The MVP has no authentication. Run it on a trusted local development machine only, and do not expose it as a publicly writable service. Secrets belong in local environment variables, never in source control.
