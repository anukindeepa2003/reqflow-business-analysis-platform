import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Dashboard', icon: 'D', end: true },
  { to: '/projects', label: 'Projects', icon: 'P', end: false },
  { to: '/requirements', label: 'Requirements', icon: 'R', end: false },
];

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/requirements': 'Requirements',
};

export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-slate-200 bg-slate-950 text-slate-100 lg:min-h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20 lg:px-6">
          <NavLink to="/" className="flex items-center gap-3 rounded-md" aria-label="ReqFlow home">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-950/30">RF</span>
            <span>
              <span className="block text-base font-semibold tracking-tight">ReqFlow</span>
              <span className="block text-[11px] text-slate-400">Requirements workspace</span>
            </span>
          </NavLink>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 lg:hidden">Alpha</span>
        </div>

        <nav aria-label="Primary navigation" className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-3 lg:pb-0 lg:pt-5">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-w-fit items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-md border border-current/20 text-xs font-bold">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 mt-8 hidden rounded-xl border border-slate-800 bg-slate-900 p-4 lg:block">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">In development</p>
          </div>
          <p className="text-xs leading-5 text-slate-400">Phase 1 establishes the application foundation. Product workflows are not implemented yet.</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 lg:h-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Workspace</p>
            <h1 className="text-lg font-semibold text-ink">{pageNames[pathname] ?? 'ReqFlow'}</h1>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">Local workspace</p>
              <p className="text-xs text-slate-400">Single-user MVP</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700" aria-hidden="true">AD</span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
