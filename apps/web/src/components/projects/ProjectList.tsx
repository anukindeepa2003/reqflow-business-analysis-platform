import type { Project, ProjectStatus } from '../../api/projects';

interface ProjectListProps {
  projects: Project[];
  deletingProjectId: string | null;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const statusPresentation: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNING: { label: 'Planning', className: 'bg-sky-50 text-sky-700' },
  ACTIVE: { label: 'Active', className: 'bg-emerald-50 text-emerald-700' },
  ON_HOLD: { label: 'On hold', className: 'bg-amber-50 text-amber-700' },
  COMPLETED: { label: 'Completed', className: 'bg-violet-50 text-violet-700' },
  ARCHIVED: { label: 'Archived', className: 'bg-slate-100 text-slate-600' },
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function ProjectList({ projects, deletingProjectId, onEdit, onDelete }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-panel">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700" aria-hidden="true">PR</span>
        <h3 className="mt-5 text-lg font-semibold text-ink">No projects yet</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Use the project form to create your first persisted workspace.</p>
      </section>
    );
  }

  return (
    <section aria-label="Project list" className="space-y-4">
      {projects.map((project) => {
        const status = statusPresentation[project.status];
        const isDeleting = deletingProjectId === project.id;

        return (
          <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {project.description ?? 'No description has been added.'}
                </p>
                <p className="mt-4 text-xs text-slate-400">Updated {dateFormatter.format(new Date(project.updatedAt))}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(project)}
                  disabled={isDeleting}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  disabled={isDeleting}
                  className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
