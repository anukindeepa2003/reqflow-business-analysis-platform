# ReqFlow Project Charter

## Document status

- **Version:** Initial Phase 1 draft
- **Context:** Portfolio case study
- **Organization:** Apex Digital Solutions (fictional)
- **Evidence notice:** The organization, stakeholders, processes, and problems in this document are simulated assumptions. They are not findings from real interviews or operational data.

## Project background

Apex Digital Solutions is a fictional software company used to frame this portfolio project. In the simulated current state, business analysts and delivery teams manage requirements across spreadsheets, documents, and email. Information can become fragmented, relationships between requirements and tests are difficult to see, and stakeholders lack one reliable view of project scope and progress.

ReqFlow will explore how a focused requirements-management application can provide a clearer, more traceable working process. The first release is deliberately local-first and single-user so that core domain behavior can be designed and tested before collaboration and security concerns are introduced.

## Problem statement

Under the simulated process, requirement details, decisions, acceptance criteria, and test references are distributed across separate tools. This makes it harder to identify the current requirement version, understand coverage, assess the impact of changes, and communicate project status consistently. These statements are hypotheses for the case study and require validation before use in a real organization.

## Business objectives

1. Provide one structured location for project requirements and their supporting information.
2. Improve visibility of relationships between requirements, acceptance criteria, and test cases.
3. Preserve a basic history of requirement changes for auditability and impact analysis.
4. Enable useful project-level status views without relying on manual spreadsheet consolidation.
5. Demonstrate a maintainable, tested product foundation suitable for incremental delivery.

## Proposed solution

Build ReqFlow, a browser-based application with a React frontend, Express REST API, and PostgreSQL database. The MVP will support projects, requirements, acceptance criteria, test cases, traceability links, search and filtering, basic statistics, and requirement change history. Phase 1 establishes only the technical and documentation foundation.

## Project scope

### In scope for the MVP

- Project management
- Requirement capture, classification, prioritization, and status tracking
- Acceptance criteria
- Test case management
- Requirement-to-test-case traceability
- Search and filtering
- Basic project dashboard statistics derived from stored data
- Basic requirement change history

### In scope for Phase 1

- npm-workspaces monorepo and strict TypeScript configuration
- Responsive application shell and honest placeholder pages
- Express API with a health endpoint
- PostgreSQL Docker Compose and Prisma scaffolding
- Initial business-analysis and architecture documentation
- Automated API health test and build/type-check commands

### Out of scope for the MVP

- Authentication and multi-user collaboration
- Role-based authorization and stakeholder approval workflows
- AI, Jira, and email integrations
- Notifications and advanced analytics
- Public production deployment

## Stakeholders

All roles below are fictional personas, not interviewed individuals.

| Stakeholder role | Interest in ReqFlow |
| --- | --- |
| Business Analyst | Capture, refine, organize, and trace requirements |
| Project Manager | Understand scope, status, risks, and delivery readiness |
| Software Engineer | Read unambiguous requirements and acceptance criteria |
| QA Engineer | Link tests to requirements and identify coverage gaps |
| Product Sponsor | Understand expected value and high-level progress |
| System Administrator (future) | Operate and secure a deployed service |

## Assumptions

- The MVP is used by one person on a local development machine.
- Users understand basic business-analysis terminology.
- Each requirement and test case belongs to exactly one project.
- Linked requirements and test cases must belong to the same project.
- Workflow statuses indicate internal tracking only, not real stakeholder approval.
- The simulated problems will be validated with real users before any real organizational adoption.

## Constraints

- The work is a final-year portfolio project with limited time and resources.
- Phase delivery must stay consistent across code, tests, and documents.
- PostgreSQL is the selected database; the local database depends on Docker being installed.
- The initial application has no authentication and must not be exposed as a publicly writable service.
- No real production or client data will be used.

## Risks

| Risk | Likelihood | Impact | Initial response |
| --- | --- | --- | --- |
| Scope grows beyond MVP | High | High | Enforce phase gates and an explicit out-of-scope list |
| Documentation diverges from behavior | Medium | High | Update docs in the same change as code and tests |
| Traceability rules are implemented inconsistently | Medium | High | Enforce rules in service transactions and database constraints where possible |
| Missing authentication is misunderstood | Medium | High | Label local-only scope and prohibit public writable deployment |
| Hypothetical evidence is presented as fact | Low | High | Mark simulated context and avoid invented outcomes or approvals |
| Local tooling prevents verification | Medium | Medium | Record blockers and never report unexecuted checks as passing |

## Success criteria

The MVP will be considered successful for this case study when:

- In-scope workflows are implemented and covered by appropriate automated tests.
- A user can manage projects, requirements, acceptance criteria, tests, and links locally.
- Invalid cross-project requirement/test links are rejected.
- Requirement updates create consistent change-history entries.
- Dashboard values are calculated from stored data rather than fabricated.
- Business and technical documentation matches the delivered behavior.
- A clean setup can run using documented prerequisites and commands.

These are target criteria, not claims of achieved outcomes. At Phase 1, only the application foundation and health endpoint are implemented.
