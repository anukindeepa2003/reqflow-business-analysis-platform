import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

export function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Project workspace"
        title="Projects"
        description="Projects will group related requirements, test cases, and traceability records. No project data is created during Phase 1."
      />
      <EmptyState
        label="Project"
        title="Project management is not implemented yet"
        description="A future phase will add validated project creation, editing, viewing, and deletion behavior backed by PostgreSQL."
      />
    </>
  );
}
