import { useEffect, useState, type FormEvent } from 'react';
import {
  requirementPriorities,
  requirementStatuses,
  requirementTypes,
  type Requirement,
  type RequirementInput,
  type RequirementPriority,
  type RequirementStatus,
  type RequirementType,
} from '../../api/requirements';

interface RequirementFormProps {
  requirement: Requirement | null;
  projectSelected: boolean;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: RequirementInput) => Promise<void>;
  onCancel: () => void;
}

const typeLabels: Record<RequirementType, string> = {
  FUNCTIONAL: 'Functional',
  NON_FUNCTIONAL: 'Non-functional',
};

const priorityLabels: Record<RequirementPriority, string> = {
  MUST: 'Must have',
  SHOULD: 'Should have',
  COULD: 'Could have',
  WONT: "Won't have this release",
};

const statusLabels: Record<RequirementStatus, string> = {
  DRAFT: 'Draft',
  READY: 'Ready',
  IN_PROGRESS: 'In progress',
  IMPLEMENTED: 'Implemented',
  DEFERRED: 'Deferred',
};

export function RequirementForm({
  requirement,
  projectSelected,
  isSaving,
  error,
  onSubmit,
  onCancel,
}: RequirementFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequirementType>('FUNCTIONAL');
  const [priority, setPriority] = useState<RequirementPriority>('MUST');
  const [status, setStatus] = useState<RequirementStatus>('DRAFT');

  useEffect(() => {
    setTitle(requirement?.title ?? '');
    setDescription(requirement?.description ?? '');
    setType(requirement?.type ?? 'FUNCTIONAL');
    setPriority(requirement?.priority ?? 'MUST');
    setStatus(requirement?.status ?? 'DRAFT');
  }, [requirement]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubmit({ title, description, type, priority, status });
      if (!requirement) {
        setTitle('');
        setDescription('');
        setType('FUNCTIONAL');
        setPriority('MUST');
        setStatus('DRAFT');
      }
    } catch {
      // The parent displays the API error while the form values remain available.
    }
  }

  const disabled = isSaving || !projectSelected;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel sm:p-6" aria-labelledby="requirement-form-title">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {requirement ? 'Edit requirement' : 'New requirement'}
        </p>
        <h3 id="requirement-form-title" className="mt-1 text-lg font-semibold text-ink">
          {requirement?.displayId ?? 'Capture a requirement'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {projectSelected
            ? 'Describe one clear, testable need within the selected project.'
            : 'Select a project before creating requirements.'}
        </p>
      </div>

      {error ? <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="requirement-title" className="mb-2 block text-sm font-medium text-slate-700">Title</label>
          <input
            id="requirement-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={2}
            maxLength={200}
            required
            disabled={disabled}
            placeholder="e.g. Record customer contact details"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          />
        </div>

        <div>
          <label htmlFor="requirement-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            id="requirement-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={10}
            maxLength={5000}
            rows={6}
            required
            disabled={disabled}
            placeholder="State what the system must do and why it matters."
            className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
          />
          <p className="mt-1.5 text-right text-xs text-slate-400">{description.length}/5000</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="requirement-type" className="mb-2 block text-sm font-medium text-slate-700">Type</label>
            <select id="requirement-type" value={type} onChange={(event) => setType(event.target.value as RequirementType)} disabled={disabled} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50">
              {requirementTypes.map((value) => <option key={value} value={value}>{typeLabels[value]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="requirement-priority" className="mb-2 block text-sm font-medium text-slate-700">MoSCoW priority</label>
            <select id="requirement-priority" value={priority} onChange={(event) => setPriority(event.target.value as RequirementPriority)} disabled={disabled} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50">
              {requirementPriorities.map((value) => <option key={value} value={value}>{priorityLabels[value]}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="requirement-status" className="mb-2 block text-sm font-medium text-slate-700">Status</label>
          <select id="requirement-status" value={status} onChange={(event) => setStatus(event.target.value as RequirementStatus)} disabled={disabled} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50">
            {requirementStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}
          </select>
          <p className="mt-2 text-xs leading-5 text-slate-400">Status is an internal tracking label, not evidence of stakeholder approval.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={disabled} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? 'Saving…' : requirement ? 'Save changes' : 'Create requirement'}
          </button>
          {requirement ? <button type="button" onClick={onCancel} disabled={isSaving} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">Cancel</button> : null}
        </div>
      </form>
    </section>
  );
}
