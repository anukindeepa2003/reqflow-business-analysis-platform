import type {
  Requirement,
  RequirementPriority,
  RequirementStatus,
  RequirementType,
} from '../../api/requirements';

interface RequirementListProps {
  requirements: Requirement[];
  deletingRequirementId: string | null;
  onEdit: (requirement: Requirement) => void;
  onDelete: (requirement: Requirement) => void;
}

const typeLabels: Record<RequirementType, string> = {
  FUNCTIONAL: 'Functional',
  NON_FUNCTIONAL: 'Non-functional',
};

const priorityLabels: Record<RequirementPriority, string> = {
  MUST: 'Must',
  SHOULD: 'Should',
  COULD: 'Could',
  WONT: "Won't",
};

const statusPresentation: Record<RequirementStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  READY: { label: 'Ready', className: 'bg-sky-50 text-sky-700' },
  IN_PROGRESS: { label: 'In progress', className: 'bg-amber-50 text-amber-700' },
  IMPLEMENTED: { label: 'Implemented', className: 'bg-emerald-50 text-emerald-700' },
  DEFERRED: { label: 'Deferred', className: 'bg-violet-50 text-violet-700' },
};

export function RequirementList({ requirements, deletingRequirementId, onEdit, onDelete }: RequirementListProps) {
  if (requirements.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-panel">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700" aria-hidden="true">RQ</span>
        <h3 className="mt-5 text-lg font-semibold text-ink">No matching requirements</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Create the first requirement or adjust the current search and filters.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="Requirements list">
      {requirements.map((requirement) => {
        const status = statusPresentation[requirement.status];
        const isDeleting = deletingRequirementId === requirement.id;

        return (
          <article key={requirement.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-bold text-brand-700">{requirement.displayId}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{typeLabels[requirement.type]}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{priorityLabels[requirement.priority]}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{requirement.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500">{requirement.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => onEdit(requirement)} disabled={isDeleting} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Edit</button>
                <button type="button" onClick={() => onDelete(requirement)} disabled={isDeleting} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">{isDeleting ? 'Deleting…' : 'Delete'}</button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
