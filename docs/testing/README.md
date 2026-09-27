# Testing documentation

Testing strategy, end-to-end scenarios, and test evidence will live in this directory.

Current automated coverage includes:

- A Supertest health-endpoint contract test.
- A PostgreSQL-backed Project API integration test covering create, list, detail, update, delete, and the not-found result after deletion.
- Project validation tests for malformed payloads and identifiers.

Project integration tests create uniquely identified temporary data and remove it before disconnecting. Docker PostgreSQL must be running for the Project API tests. Playwright remains intentionally deferred until a later phase with broader user journeys.
