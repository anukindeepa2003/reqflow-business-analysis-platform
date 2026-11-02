# Business Requirements Document (Initial Draft)

## 1. Document purpose and status

This initial Business Requirements Document defines the intended business outcomes and MVP boundary for ReqFlow. It is a portfolio case study based on a simulated organization, Apex Digital Solutions. It has not been approved by real stakeholders and must not be presented as such.

Detailed functional and non-functional software requirements will be developed and traced in later approved phases. “Shall” statements below describe targets, not completed functionality.

## 2. Business objectives

- Establish a single structured view of requirement information within each project.
- Improve traceability from a requirement to its acceptance criteria and test cases.
- Make requirement status and change information easier to inspect.
- Reduce the simulated effort needed to consolidate basic project views manually.
- Create an incremental platform whose behavior can be tested and explained.

## 3. Business requirements

| ID | Business requirement | Rationale | MVP status |
| --- | --- | --- | --- |
| BR-001 | The solution shall provide a centralized workspace for project requirement information. | Reduces fragmentation across simulated documents and spreadsheets. | Partially implemented: projects and requirements |
| BR-002 | The solution shall preserve relationships among projects, requirements, acceptance criteria, and test cases. | Supports context and end-to-end traceability. | Partially implemented: Project–Requirement ownership |
| BR-003 | The solution shall enable requirements to be classified, prioritized, and tracked by status. | Supports analysis and delivery planning. | Implemented for Requirements |
| BR-004 | The solution shall show which test cases are linked to each requirement. | Makes test coverage inspectable. | Planned |
| BR-005 | The solution shall retain a basic record of material requirement changes. | Supports auditability and impact analysis. | Planned |
| BR-006 | The solution shall support search and filtering over requirement information. | Helps users find and review relevant records. | Implemented for title/description and current classifications |
| BR-007 | The solution shall provide basic, source-derived project statistics. | Supports project visibility without invented metrics. | Planned |
| BR-008 | The solution shall protect data integrity, including rejecting cross-project requirement/test links. | Prevents invalid traceability relationships. | Planned |
| BR-009 | The MVP shall operate as a single-user, local-first application. | Keeps initial scope feasible while core behavior is established. | Foundation implemented |

## 4. In-scope features

1. Project creation, viewing, updating, and a documented deletion policy.
2. Requirement capture and maintenance.
3. Requirement classification, priority, and lifecycle status.
4. Acceptance criteria associated with requirements.
5. Project test cases.
6. Many-to-many links between requirements and test cases within the same project.
7. Basic search and filtering.
8. Basic project statistics calculated from persisted records.
9. Basic change history for requirement updates.

Phase 1 implemented the foundation. Phase 2 implemented persisted Project management. Phase 3 implements project-owned Requirement creation, listing, detail API access, editing, confirmed deletion, functional/non-functional classification, MoSCoW priority, simulated lifecycle status, stable readable identifiers, and search/filtering. Acceptance criteria, test cases, traceability, and change history remain planned.

## 5. Out-of-scope features

- Login, identity management, and multi-user sessions
- Roles, permissions, and formal approval workflows
- Real-time collaboration
- AI assistance
- Jira, email, or other external integrations
- Notifications
- Advanced analytics or predictive reporting
- Production hosting or public writable access

## 6. Assumptions

- The initial user is a business analyst or software delivery practitioner running the system locally.
- A project is the ownership boundary for requirements and test cases.
- Requirement identifiers must remain readable and stable for display.
- Dates are stored in UTC and formatted for presentation at the UI boundary.
- Real stakeholder discovery could change terminology, fields, workflow, and priority.

## 7. Constraints

- The prescribed stack is React, TypeScript, Vite, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma, and Zod.
- The project uses an npm-workspaces monorepo and strict TypeScript.
- Phase scope must be explicitly approved before implementation proceeds.
- The unauthenticated MVP cannot be safely exposed as a public writable application.
- No claims may imply real stakeholder approval, production outcomes, or operational adoption.

## 8. Dependencies

- Node.js and npm for workspace development and testing
- Docker with Docker Compose for the planned local PostgreSQL service
- Git for version control
- Browser support compatible with the selected Vite/React output
- Later agreement on the detailed domain model, deletion behavior, field definitions, and lifecycle values

## 9. Open business questions

- Which requirement types, priorities, and statuses are valuable rather than merely conventional?
- What constitutes a material change for history purposes?
- Should project deletion be allowed when traceability data exists, and what confirmation/evidence is required?
- Which test status and coverage views support real decisions?
- Which dashboard statistics have a clearly identified consumer and decision?

These questions are intentionally unresolved; later elicitation and design work should answer them before corresponding behavior is claimed complete.
