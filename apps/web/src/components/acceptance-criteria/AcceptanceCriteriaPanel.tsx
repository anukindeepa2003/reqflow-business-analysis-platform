import { useEffect, useState, type FormEvent } from 'react';
import {
  createAcceptanceCriterion,
  deleteAcceptanceCriterion,
  getAcceptanceCriteria,
  reorderAcceptanceCriteria,
  updateAcceptanceCriterion,
  type AcceptanceCriterion,
} from '../../api/acceptanceCriteria';
import type { Requirement } from '../../api/requirements';

interface AcceptanceCriteriaPanelProps {
  projectId: string;
  requirement: Requirement;
  onClose: () => void;
}

export function AcceptanceCriteriaPanel({
  projectId,
  requirement,
  onClose,
}: AcceptanceCriteriaPanelProps) {
  const [criteria, setCriteria] = useState<AcceptanceCriterion[]>([]);
  const [description, setDescription] = useState('');
  const [editingCriterion, setEditingCriterion] = useState<AcceptanceCriterion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyCriterionId, setBusyCriterionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setCriteria([]);
    setDescription('');
    setEditingCriterion(null);
    setError(null);

    void getAcceptanceCriteria(projectId, requirement.id)
      .then((data) => {
        if (active) setCriteria(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Acceptance criteria could not be loaded.',
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId, requirement.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingCriterion) {
        const updated = await updateAcceptanceCriterion(
          projectId,
          requirement.id,
          editingCriterion.id,
          description,
        );
        setCriteria((current) =>
          current.map((criterion) => (criterion.id === updated.id ? updated : criterion)),
        );
        setEditingCriterion(null);
      } else {
        const created = await createAcceptanceCriterion(projectId, requirement.id, description);
        setCriteria((current) => [...current, created]);
      }
      setDescription('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The acceptance criterion could not be saved.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(criterion: AcceptanceCriterion) {
    setEditingCriterion(criterion);
    setDescription(criterion.description);
    setError(null);
  }

  function cancelEditing() {
    setEditingCriterion(null);
    setDescription('');
    setError(null);
  }

  async function handleDelete(criterion: AcceptanceCriterion) {
    if (!window.confirm(`Delete ${criterion.displayId}? This cannot be undone.`)) return;
    setBusyCriterionId(criterion.id);
    setError(null);

    try {
      await deleteAcceptanceCriterion(projectId, requirement.id, criterion.id);
      setCriteria((current) => current.filter((item) => item.id !== criterion.id));
      if (editingCriterion?.id === criterion.id) cancelEditing();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The acceptance criterion could not be deleted.',
      );
    } finally {
      setBusyCriterionId(null);
    }
  }

  async function moveCriterion(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= criteria.length) return;

    const reordered = [...criteria];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex]!,
      reordered[index]!,
    ];
    setBusyCriterionId(criteria[index]!.id);
    setError(null);

    try {
      const saved = await reorderAcceptanceCriteria(
        projectId,
        requirement.id,
        reordered.map((criterion) => criterion.id),
      );
      setCriteria(saved);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The acceptance criteria order could not be saved.',
      );
    } finally {
      setBusyCriterionId(null);
    }
  }

  const isBusy = isSaving || busyCriterionId !== null;

  return (
    <section
      className="mb-5 rounded-2xl border border-brand-200 bg-brand-50/40 p-5 shadow-panel sm:p-6"
      aria-labelledby="acceptance-criteria-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {requirement.displayId}
          </p>
          <h3 id="acceptance-criteria-title" className="mt-1 text-lg font-semibold text-ink">
            Acceptance criteria
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Define the observable conditions that make “{requirement.title}” acceptable.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          Close
        </button>
      </div>

      {error ? (
        <div role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="acceptance-criterion-description" className="mb-2 block text-sm font-medium text-slate-700">
          {editingCriterion ? `Edit ${editingCriterion.displayId}` : 'New acceptance criterion'}
        </label>
        <textarea
          id="acceptance-criterion-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          minLength={5}
          maxLength={2000}
          rows={3}
          required
          disabled={isBusy}
          placeholder="e.g. Given valid details, when the analyst saves, then the contact appears in the project."
          className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">{description.length}/2000</span>
          <div className="flex gap-2">
            {editingCriterion ? (
              <button type="button" onClick={cancelEditing} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
            ) : null}
            <button type="submit" disabled={isBusy} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? 'Saving…' : editingCriterion ? 'Save criterion' : 'Add criterion'}
            </button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-slate-500" role="status">Loading acceptance criteria…</div>
      ) : criteria.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No acceptance criteria yet</p>
          <p className="mt-1 text-sm text-slate-500">Add the first measurable condition using the form above.</p>
        </div>
      ) : (
        <ol className="mt-4 space-y-3" aria-label={`Acceptance criteria for ${requirement.displayId}`}>
          {criteria.map((criterion, index) => {
            const itemBusy = busyCriterionId === criterion.id;
            return (
              <li key={criterion.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-bold text-brand-700">
                      {criterion.displayId}
                    </span>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button type="button" onClick={() => void moveCriterion(index, -1)} disabled={isBusy || index === 0} aria-label={`Move ${criterion.displayId} up`} className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">↑</button>
                    <button type="button" onClick={() => void moveCriterion(index, 1)} disabled={isBusy || index === criteria.length - 1} aria-label={`Move ${criterion.displayId} down`} className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">↓</button>
                    <button type="button" onClick={() => startEditing(criterion)} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Edit</button>
                    <button type="button" onClick={() => void handleDelete(criterion)} disabled={isBusy} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">{itemBusy ? 'Working…' : 'Delete'}</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
