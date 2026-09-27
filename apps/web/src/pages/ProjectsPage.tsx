import { useEffect, useState } from 'react';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
  type ProjectInput,
} from '../api/projects';
import { PageHeader } from '../components/PageHeader';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ProjectList } from '../components/projects/ProjectList';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    void loadProjects();
  }, []);

  async function loadProjects() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setProjects(await getProjects());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Projects could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(input: ProjectInput) {
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingProject) {
        const updatedProject = await updateProject(editingProject.id, input);
        setProjects((current) =>
          current
            .map((project) => (project.id === updatedProject.id ? updatedProject : project))
            .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
        );
        setEditingProject(null);
      } else {
        const project = await createProject(input);
        setProjects((current) => [project, ...current]);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'The project could not be saved.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete “${project.name}”? This permanently removes the project and cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingProjectId(project.id);
    setLoadError(null);

    try {
      await deleteProject(project.id);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (editingProject?.id === project.id) setEditingProject(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'The project could not be deleted.');
    } finally {
      setDeletingProjectId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Project workspace"
        title="Projects"
        description="Create and maintain persisted project workspaces. Requirements, tests, and traceability will be added to these projects in later phases."
      />

      {loadError ? (
        <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{loadError}</span>
          <button type="button" onClick={() => void loadProjects()} className="self-start font-semibold underline underline-offset-2 sm:self-auto">Try again</button>
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <ProjectForm
          project={editingProject}
          isSaving={isSaving}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingProject(null);
            setFormError(null);
          }}
        />

        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portfolio</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Your projects</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-panel" role="status">Loading projects…</div>
          ) : (
            <ProjectList
              projects={projects}
              deletingProjectId={deletingProjectId}
              onEdit={(project) => {
                setEditingProject(project);
                setFormError(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={(project) => void handleDelete(project)}
            />
          )}
        </div>
      </div>
    </>
  );
}
