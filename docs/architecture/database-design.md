# Initial Database Design

## Status

This is a Phase 1 design document, not an implemented schema. The Prisma datasource and generator are configured, but application models and migrations are intentionally deferred until a later approved phase.

## Conventions

- Every primary key will be a UUID generated independently of display identifiers.
- Foreign keys will be explicit and use PostgreSQL referential integrity.
- Timestamps will be stored as UTC instants (`timestamptz` through the eventual Prisma mapping).
- Records that are displayed externally will use stable readable identifiers where needed.
- Indexes will follow actual query patterns; foreign keys and common filters are initial candidates.

## Planned entities

### Project

- **Primary key:** UUID `id`
- **Purpose:** Ownership boundary for requirements and test cases.
- **Likely attributes:** name, description, lifecycle status, created/updated timestamps.
- **Relationships:** One project has many requirements and many test cases.

### Requirement

- **Primary key:** UUID `id`
- **Foreign key:** `projectId -> Project.id`
- **Purpose:** Stores a project requirement and its classification, priority, and status.
- **Likely attributes:** display key/sequence, title, description, type, priority, status, timestamps.
- **Relationships:** Belongs to a project; has many acceptance criteria, change records, and linked test cases.

### AcceptanceCriterion

- **Primary key:** UUID `id`
- **Foreign key:** `requirementId -> Requirement.id`
- **Purpose:** Captures a verifiable condition for a requirement.
- **Likely attributes:** description, position/order, timestamps.
- **Relationships:** Belongs to exactly one requirement.

### TestCase

- **Primary key:** UUID `id`
- **Foreign key:** `projectId -> Project.id`
- **Purpose:** Describes a test that can provide evidence for one or more requirements.
- **Likely attributes:** display key/sequence, title, preconditions, steps, expected result, status, timestamps.
- **Relationships:** Belongs to a project; links to many requirements.

### RequirementTestCase

- **Primary key:** Either a UUID or a documented composite key; not finalized.
- **Foreign keys:** `requirementId -> Requirement.id`, `testCaseId -> TestCase.id`.
- **Purpose:** Many-to-many junction between requirements and test cases.
- **Required constraint:** A requirement/test pair must be unique.
- **Required invariant:** Both linked records must belong to the same project.

The same-project invariant cannot be safely delegated only to the UI. The service will verify it within the write transaction. During schema implementation, the team will evaluate whether denormalizing `projectId` into the junction plus composite foreign keys provides worthwhile database-level enforcement without creating unnecessary update complexity.

### RequirementChange

- **Primary key:** UUID `id`
- **Foreign key:** `requirementId -> Requirement.id`
- **Purpose:** Provides a basic audit trail of material requirement changes.
- **Likely attributes:** field/change summary, previous value, new value, reason (if required), changed timestamp.
- **Relationships:** Belongs to exactly one requirement.

Because the MVP is single-user without authentication, a trustworthy user identity cannot be recorded. The schema must not invent an actor. Actor information can be added when identity is implemented.

## Relationship summary

```text
Project 1 ----- * Requirement 1 ----- * AcceptanceCriterion
   |                  |
   |                  *
   |          RequirementTestCase
   |                  *
   * ----- * TestCase

Requirement 1 ----- * RequirementChange
```

## Readable identifiers

UUIDs are good persistent keys but poor identifiers in discussion. Requirements and test cases should therefore expose stable project-scoped display keys such as `REQ-0001` and `TC-0001` derived from persisted sequence data, not from row counts or array positions. The exact prefix and sequence allocation strategy are not finalized. A display key must not be reused after deletion, and title edits must not change it.

## Transaction boundaries

- Updating a requirement and inserting its `RequirementChange` records must occur in one database transaction.
- Creating a requirement/test link must validate project ownership and create the junction record within one transaction where required to avoid time-of-check/time-of-use inconsistencies.
- Multi-record deletes must either complete fully or roll back.

## Data integrity considerations

- Required fields should be non-null at the database level.
- Unique constraints should prevent duplicate project-scoped display keys and duplicate traceability links.
- Foreign keys should prevent orphan acceptance criteria, traceability links, and change records.
- Zod validation will enforce input shape and supported enum values before persistence.
- Services will enforce rules that depend on multiple records; supported database constraints will provide a second line of defense.
- Length limits and normalization rules will be defined before migrations, not inferred only from UI controls.

## Project deletion policy

The planned MVP policy is an explicit, confirmed hard delete for local test/portfolio data. Deleting a project will atomically remove its requirements, acceptance criteria, test cases, traceability links, and change records. Cascades may implement the database portion, but the API must require an unambiguous project-specific confirmation and must not expose a broad bulk-delete endpoint.

This choice avoids unusable orphan records in a single-user MVP. It is not automatically suitable for a real regulated or collaborative system, where archival, retention periods, backups, and audit requirements would need stakeholder and legal input. Until implemented and tested, project deletion remains unavailable.

## Decisions not finalized

- Exact field names, lengths, and optionality
- Requirement type, priority, and status vocabularies
- Test case status vocabulary and step representation
- Junction-table primary key strategy and database enforcement of project equality
- Project-scoped sequence allocation and readable-key prefixes
- Which changes qualify for history and how structured the history payload should be
- Whether optimistic concurrency/version fields are needed
- Retention, archival, backup, and recovery requirements beyond the local MVP
