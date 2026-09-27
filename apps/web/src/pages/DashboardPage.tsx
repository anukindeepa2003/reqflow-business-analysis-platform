import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';

type ApiState = 'checking' | 'connected' | 'unavailable';

export function DashboardPage() {
  const [apiState, setApiState] = useState<ApiState>('checking');

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = import.meta.env.VITE_API_URL ?? '';

    fetch(`${baseUrl}/api/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API health check failed');
        setApiState('connected');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setApiState('unavailable');
      });

    return () => controller.abort();
  }, []);

  const connectionLabel = {
    checking: 'Checking API',
    connected: 'API connected',
    unavailable: 'API unavailable',
  }[apiState];

  const connectionColor = {
    checking: 'bg-amber-400',
    connected: 'bg-emerald-500',
    unavailable: 'bg-rose-500',
  }[apiState];

  return (
    <>
      <PageHeader
        eyebrow="Phase 1 foundation"
        title="A clearer home for software requirements"
        description="ReqFlow is being built to help business analysts connect project requirements, acceptance criteria, test coverage, and change history in one structured workspace."
      />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Foundation status">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">01</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Ready</span>
          </div>
          <h3 className="mt-5 font-semibold text-ink">Application shell</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Responsive navigation and placeholder routes are in place.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">02</span>
            <span className="flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              <span className={`h-2 w-2 rounded-full ${connectionColor}`} aria-hidden="true" />
              {connectionLabel}
            </span>
          </div>
          <h3 className="mt-5 font-semibold text-ink">Backend health</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">This status is read from the real local health endpoint.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">03</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Planned</span>
          </div>
          <h3 className="mt-5 font-semibold text-ink">Product workflows</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Project and requirement operations begin in a later approved phase.</p>
        </article>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 p-6 sm:p-8" aria-labelledby="current-scope-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Current scope</p>
          <h3 id="current-scope-heading" className="mt-2 text-xl font-semibold text-ink">Foundation before features</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">This screen intentionally avoids invented project metrics. The current release proves the frontend-to-backend connection and establishes a maintainable structure for the real workflows that follow.</p>
        </div>
      </section>
    </>
  );
}
