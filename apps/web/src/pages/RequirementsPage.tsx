import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProjects, type Project } from '../api/projects';
import {
  createRequirement,
  deleteRequirement,
  getRequirements,
  requirementPriorities,
  requirementStatuses,
  requirementTypes,
  updateRequirement,
  type Requirement,
  type RequirementFilters,
  type RequirementInput,
  type RequirementPriority,
  type RequirementStatus,
  type RequirementType,
} from '../api/requirements';
import { PageHeader } from '../components/PageHeader';
import { AcceptanceCriteriaPanel } from '../components/acceptance-criteria/AcceptanceCriteriaPanel';
import { RequirementForm } from '../components/requirements/RequirementForm';
import { RequirementList } from '../components/requirements/RequirementList';

export function RequirementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get('projectId') ?? '');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [filters, setFilters] = useState<RequirementFilters>({});
  const [searchDraft, setSearchDraft] = useState('');
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [criteriaRequirement, setCriteriaRequirement] = useState<Requirement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingRequirementId, setDeletingRequirementId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getProjects()
      .then((availableProjects) => {
        if (!active) return;
        setProjects(availableProjects);
        const requestedProjectId = searchParams.get('projectId');
        const validRequestedProject = availableProjects.some((project) => project.id === requestedProjectId);
        const projectId = validRequestedProject ? requestedProjectId! : (availableProjects[0]?.id ?? '');
        setSelectedProjectId(projectId);
        if (projectId) setSearchParams({ projectId }, { replace: true });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : 'Projects could not be loaded.');
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setRequirements([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    let active = true;
    void getRequirements(selectedProjectId, filters)
      .then((data) => {
        if (active) setRequirements(data);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Requirements could not be loaded.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedProjectId, filters]);

  function chooseProject(projectId: string) {
    setSelectedProjectId(projectId);
    setEditingRequirement(null);
    setCriteriaRequirement(null);
    setFormError(null);
    setSearchParams(projectId ? { projectId } : {}, { replace: true });
  }

  async function handleSubmit(input: RequirementInput) {
    if (!selectedProjectId) return;
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingRequirement) {
        await updateRequirement(selectedProjectId, editingRequirement.id, input);
        setEditingRequirement(null);
      } else {
        await createRequirement(selectedProjectId, input);
      }
      setRequirements(await getRequirements(selectedProjectId, filters));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'The requirement could not be saved.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(requirement: Requirement) {
    if (!selectedProjectId) return;
    if (!window.confirm(`Delete ${requirement.displayId} “${requirement.title}”? This cannot be undone.`)) return;
    setDeletingRequirementId(requirement.id);
    setLoadError(null);

    try {
      await deleteRequirement(selectedProjectId, requirement.id);
      setRequirements((current) => current.filter((item) => item.id !== requirement.id));
      if (editingRequirement?.id === requirement.id) setEditingRequirement(null);
      if (criteriaRequirement?.id === requirement.id) setCriteriaRequirement(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'The requirement could not be deleted.');
    } finally {
      setDeletingRequirementId(null);
    }
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters((current) => ({ ...current, search: searchDraft.trim() || undefined }));
  }

  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  return (
    <>
      <PageHeader
        eyebrow="Requirements workspace"
        title="Requirements"
        description="Capture, classify, prioritize, search, and track project requirements and their acceptance criteria. Test cases and change history remain planned for later phases."
      />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel" aria-labelledby="project-context-title">
        <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_2fr] lg:items-end">
          <div>
            <label id="project-context-title" htmlFor="requirement-project" className="mb-2 block text-sm font-medium text-slate-700">Project</label>
            <select id="requirement-project" value={selectedProjectId} onChange={(event) => chooseProject(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100">
              {projects.length === 0 ? <option value="">No projects available</option> : null}
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            {selectedProject ? `Showing requirements owned by ${selectedProject.name}. Readable IDs are unique within this project.` : 'Create a project before adding requirements.'}
          </p>
        </div>
      </section>

      {loadError ? <div role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</div> : null}

      <div className="grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <RequirementForm requirement={editingRequirement} projectSelected={Boolean(selectedProjectId)} isSaving={isSaving} error={formError} onSubmit={handleSubmit} onCancel={() => { setEditingRequirement(null); setFormError(null); }} />

        <div>
          {criteriaRequirement ? (
            <AcceptanceCriteriaPanel
              projectId={selectedProjectId}
              requirement={criteriaRequirement}
              onClose={() => setCriteriaRequirement(null)}
            />
          ) : null}

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Selected project</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{selectedProject?.name ?? 'Requirements register'}</h3>
            </div>
            <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{requirements.length} {requirements.length === 1 ? 'requirement' : 'requirements'}</span>
          </div>

          <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4" aria-label="Requirement filters">
            <form onSubmit={applySearch} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
              <label className="sr-only" htmlFor="requirement-search">Search requirements</label>
              <input id="requirement-search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search title or description" maxLength={200} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
              <label className="sr-only" htmlFor="filter-type">Filter by type</label>
              <select id="filter-type" value={filters.type ?? ''} onChange={(event) => setFilters((current) => ({ ...current, type: (event.target.value || undefined) as RequirementType | undefined }))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="">All types</option>{requirementTypes.map((value) => <option key={value} value={value}>{value === 'FUNCTIONAL' ? 'Functional' : 'Non-functional'}</option>)}</select>
              <label className="sr-only" htmlFor="filter-priority">Filter by priority</label>
              <select id="filter-priority" value={filters.priority ?? ''} onChange={(event) => setFilters((current) => ({ ...current, priority: (event.target.value || undefined) as RequirementPriority | undefined }))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="">All priorities</option>{requirementPriorities.map((value) => <option key={value} value={value}>{value}</option>)}</select>
              <label className="sr-only" htmlFor="filter-status">Filter by status</label>
              <select id="filter-status" value={filters.status ?? ''} onChange={(event) => setFilters((current) => ({ ...current, status: (event.target.value || undefined) as RequirementStatus | undefined }))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="">All statuses</option>{requirementStatuses.map((value) => <option key={value} value={value}>{value.replace('_', ' ')}</option>)}</select>
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Search</button>
            </form>
          </section>

          {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-panel" role="status">Loading requirements…</div> : <RequirementList requirements={requirements} deletingRequirementId={deletingRequirementId} onManageCriteria={(requirement) => { setCriteriaRequirement(requirement); setEditingRequirement(null); setFormError(null); }} onEdit={(requirement) => { setEditingRequirement(requirement); setCriteriaRequirement(null); setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={(requirement) => void handleDelete(requirement)} />}
        </div>
      </div>
    </>
  );
}
