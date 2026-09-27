import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

export function RequirementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Requirements workspace"
        title="Requirements"
        description="Requirements will capture classifications, priorities, statuses, acceptance criteria, linked tests, and an auditable change history."
      />
      <EmptyState
        label="Requirement"
        title="Requirement management is not implemented yet"
        description="This placeholder marks the planned module without presenting fabricated requirements or suggesting unfinished workflows are available."
      />
    </>
  );
}
