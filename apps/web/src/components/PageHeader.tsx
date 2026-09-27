interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{description}</p>
    </header>
  );
}
