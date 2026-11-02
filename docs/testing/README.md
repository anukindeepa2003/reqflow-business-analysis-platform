# Testing documentation

Testing strategy, end-to-end scenarios, and test evidence will live in this directory.

Current automated coverage includes:

- A Supertest health-endpoint contract test.
- A PostgreSQL-backed Project API integration test covering create, list, detail, update, delete, and the not-found result after deletion.
- Project validation tests for malformed payloads and identifiers.
- PostgreSQL-backed Requirement API integration tests covering project-scoped create, list, detail, update, delete, filtering, search, validation, and missing-project behavior.
- Readable-identifier tests proving sequential allocation and non-reuse after deletion.
- PostgreSQL-backed Acceptance Criteria API integration tests covering requirement-scoped create, list, update, delete, stable identifier allocation, ordering, validation, and cross-project isolation.

Database integration tests create temporary projects, requirements, and acceptance criteria and remove them before disconnecting. Files run serially because they share one local integration database. Docker PostgreSQL must be running for these API tests. Playwright remains intentionally deferred until a later phase with broader user journeys.
