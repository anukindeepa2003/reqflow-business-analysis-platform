interface EmptyStateProps {
  label: string;
  title: string;
  description: string;
}

export function EmptyState({ label, title, description }: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-panel" aria-labelledby={`${label}-empty-title`}>
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700" aria-hidden="true">{label.slice(0, 2).toUpperCase()}</span>
      <h3 id={`${label}-empty-title`} className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{description}</p>
      <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Planned for Phase 2</span>
    </section>
  );
}
