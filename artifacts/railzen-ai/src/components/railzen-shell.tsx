import { type ReactNode, useState } from 'react';
import {
  Activity,
  Bell,
  Bot,
  CalendarClock,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Menu,
  MoreHorizontal,
  Settings,
  Siren,
  TrainFront,
  Wrench,
  X,
  Zap,
  Building2,
  Search,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useRailzenWorkspace } from '@/components/railzen-workspace';

export type RailzenNavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
};

export const navigation: RailzenNavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, href: '/' },
  { label: 'Maintenance Planning', icon: CalendarClock, href: '/maintenance' },
  { label: 'Network', icon: MapPinned, href: '/network' },
  { label: 'Assets', icon: TrainFront, href: '/assets' },
  { label: 'Alerts', icon: Siren, href: '/alerts' },
  { label: 'Analytics', icon: LineChart, href: '/analytics' },
  { label: 'Reports', icon: FileText, href: '/reports' },
  { label: 'AI Assistant', icon: Bot, href: '/ai-assistant' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

function RailzenMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`railzen-mark flex items-center justify-center rounded-xl ${
        compact ? 'h-9 w-9' : 'h-10 w-10'
      }`}
      aria-label="RailZen AI"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M8 5v18M24 5v18M8 11h16M8 17h16M8 23h16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle
          cx="16"
          cy="5"
          r="2.4"
          fill="hsl(var(--accent))"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          cx="16"
          cy="23"
          r="2.4"
          fill="hsl(var(--primary))"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}

export function RailzenShell({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { network, setNetwork } = useRailzenWorkspace();
  const [query, setQuery] = useState('');

  const activeNav =
    navigation.find((item) => item.href === location)?.label ?? 'Overview';

  const navTitle = activeNav === 'Overview' ? 'Network overview' : activeNav;

  const goTo = (href: string) => {
    setMobileNavOpen(false);
    navigate(href);
  };

  return (
    <main className="railzen-page flex min-h-[100dvh] bg-background">
      <aside className="hidden w-[246px] shrink-0 flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-4 py-5 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <RailzenMark compact />
          <div>
            <p className="font-display text-[15px] font-bold tracking-[-.035em] text-foreground">
              RailZen <span className="text-[hsl(var(--primary))]">AI</span>
            </p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">
              Control workspace
            </p>
          </div>
        </div>

        <div className="mt-9 px-2">
          <p className="font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">
            Workspace
          </p>
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-between rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] px-3 py-2.5 text-left hover:border-[hsl(var(--primary)/.45)]"
          >
            <span>
              <span className="block text-xs font-semibold text-foreground">{network}</span>
              <span className="mt-0.5 block font-mono text-[9px] text-muted-foreground">
                DEMO OPERATING AREA
              </span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <nav className="mt-8 flex-1" aria-label="Primary navigation">
          <p className="px-2 font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">
            Operations
          </p>

          <div className="mt-2 space-y-1">
            {navigation.map(({ label, icon: Icon, href }) => {
              const active = location === href;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => goTo(href)}
                  className={`railzen-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active
                      ? 'is-active text-foreground'
                      : 'text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                  {label === 'Alerts' && (
                    <span className="ml-auto rounded-full bg-[hsl(var(--destructive)/.14)] px-1.5 py-0.5 font-mono text-[9px] text-[hsl(var(--destructive))]">
                      03
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">
              Data mode
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          </div>
          <p className="mt-2 text-[11px] font-medium leading-5 text-foreground">
            Demonstration data only
          </p>
          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
            Not connected to a government or railway authority feed.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-[hsl(var(--sidebar-border))] px-2 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/.16)] font-mono text-[10px] font-medium text-[hsl(var(--primary))]">
            OM
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">Operations Manager</p>
            <p className="truncate text-[10px] text-muted-foreground">Network control</p>
          </div>
          <button
            type="button"
            className="ml-auto text-muted-foreground hover:text-foreground"
            aria-label="Open profile"
            onClick={() => setProfileOpen((open) => !open)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div
          className="railzen-mobile-drawer fixed inset-0 z-40 bg-[hsl(var(--background)/.78)] backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        >
          <aside
            className="flex h-full w-[min(82vw,290px)] flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-4 py-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <RailzenMark compact />
                <p className="font-display text-[15px] font-bold text-foreground">
                  RailZen <span className="text-[hsl(var(--primary))]">AI</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <nav className="mt-10 flex-1 space-y-1" aria-label="Mobile navigation">
              {navigation.map(({ label, icon: Icon, href }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => goTo(href)}
                  className={`railzen-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-semibold ${
                    location === href
                      ? 'is-active text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>

            <p className="border-t border-[hsl(var(--sidebar-border))] pt-4 font-mono text-[9px] uppercase leading-5 tracking-[.14em] text-muted-foreground">
              DEMO DATA
              <br />
              Not a live railway feed
            </p>
          </aside>
        </div>
      )}

      <section className="min-w-0 flex-1">
        <header className="railzen-topbar sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.88)] px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground sm:inline">
                  Control room
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[hsl(var(--border))] sm:inline" />
                <h1 className="truncate font-display text-base font-bold tracking-[-.025em] text-foreground sm:text-lg">
                  {navTitle}
                </h1>
              </div>
              <p className="mt-1 hidden truncate text-[11px] text-muted-foreground sm:block">
                AI-Powered Railway Maintenance Planning &amp; Optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 lg:flex">
              <Building2 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <span className="sr-only">Railway region</span>
              <select
                value={network}
                onChange={(event) => setNetwork(event.target.value)}
                className="appearance-none bg-transparent text-[11px] font-semibold text-foreground outline-none"
              >
                <option>Northline Region</option>
                <option>East Junction</option>
                <option>Coastal Corridor</option>
              </select>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </label>

            <label className="hidden items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 md:flex">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="sr-only">Search workspace</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search workspace"
                className="w-28 bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground xl:w-40"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </label>

            <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-1.5 sm:flex">
              <span className="relative inline-flex h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--primary))]" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Services operational
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNoticeOpen((open) => !open)}
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"
                aria-label="View notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
              </button>

              {noticeOpen && (
                <div className="railzen-popover absolute right-0 top-11 z-40 w-72 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--popover))] p-3 shadow-[var(--shadow-md)]">
                  <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
                    <p className="text-xs font-semibold text-foreground">Notifications</p>
                    <span className="font-mono text-[9px] text-[hsl(var(--accent))]">
                      03 UNREAD
                    </span>
                  </div>
                  <p className="py-4 text-xs leading-5 text-muted-foreground">
                    Turnout 14B needs planner review before the 18:30 access window.
                  </p>
                  <button
                    type="button"
                    onClick={() => setNoticeOpen(false)}
                    className="text-[11px] font-semibold text-[hsl(var(--primary))]"
                  >
                    Mark view complete
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg p-1.5 pr-2 hover:bg-[hsl(var(--secondary))]"
                aria-label="Open user menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/.16)] font-mono text-[10px] font-medium text-[hsl(var(--primary))]">
                  OM
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-[11px] font-semibold text-foreground">
                    Operations Manager
                  </span>
                  <span className="block text-[9px] text-muted-foreground">Network control</span>
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </button>

              {profileOpen && (
                <div className="railzen-popover absolute right-0 top-12 z-40 w-44 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--popover))] p-1.5 shadow-[var(--shadow-md)]">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"
                  >
                    Workspace settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"
                  >
                    Close menu
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1640px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          {children}

          <footer className="mt-8 flex flex-col gap-2 border-t border-[hsl(var(--border))] py-5 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono uppercase tracking-[.14em]">
              RailZen AI · Northline operating workspace
            </span>
            <span>DEMO DATA · Not a live government or railway authority feed</span>
          </footer>
        </div>
      </section>
    </main>
  );
}