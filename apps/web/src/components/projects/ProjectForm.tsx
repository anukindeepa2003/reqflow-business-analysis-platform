import { useEffect, useState, type FormEvent } from 'react';
import {
  projectStatuses,
  type Project,
  type ProjectInput,
  type ProjectStatus,
} from '../../api/projects';

interface ProjectFormProps {
  project: Project | null;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: ProjectInput) => Promise<void>;
  onCancel: () => void;
}

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  ACTIVE: 'Active',
  ON_HOLD: 'On hold',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export function ProjectForm({
  project,
  isSaving,
  error,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('PLANNING');

  useEffect(() => {
    setName(project?.name ?? '');
    setDescription(project?.description ?? '');
    setStatus(project?.status ?? 'PLANNING');
  }, [project]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubmit({
        name,
        description: description.trim() || null,
        status,
      });

      if (!project) {
        setName('');
        setDescription('');
        setStatus('PLANNING');
      }
    } catch {
      // The parent displays the API error while preserving the user's form values.
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel sm:p-6" aria-labelledby="project-form-title">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{project ? 'Edit project' : 'New project'}</p>
        <h3 id="project-form-title" className="mt-1 text-lg font-semibold text-ink">
          {project ? project.name : 'Create a project'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {project
            ? 'Update the project details and lifecycle status.'
            : 'Start a workspace that will contain requirements and test cases in later phases.'}
        </p>
      </div>

      {error ? (
        <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-slate-700">Project name</label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={120}
            required
            disabled={isSaving}
            placeholder="e.g. Customer Support Portal"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          />
        </div>

        <div>
          <label htmlFor="project-description" className="mb-2 block text-sm font-medium text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={5}
            disabled={isSaving}
            placeholder="Briefly explain the purpose and scope."
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          />
          <p className="mt-1.5 text-right text-xs text-slate-400">{description.length}/2000</p>
        </div>

        <div>
          <label htmlFor="project-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
          <select
            id="project-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            disabled={isSaving}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          >
            {projectStatuses.map((value) => (
              <option key={value} value={value}>{statusLabels[value]}</option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-5 text-slate-400">Status is an internal tracking label, not evidence of stakeholder approval.</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : project ? 'Save changes' : 'Create project'}
          </button>
          {project ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
