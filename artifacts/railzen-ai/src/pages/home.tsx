import { useHealthCheck, useRailzenHealth } from '@workspace/api-client-react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gauge,
  LayoutDashboard,
  LineChart,
  ListChecks,
  MapPinned,
  Menu,
  MoreHorizontal,
  PackageCheck,
  Radio,
  RefreshCw,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  TrainFront,
  UserRound,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

type ConnectionState = 'loading' | 'connected' | 'not-connected';

type MaintenanceTask = {
  id: string;
  asset: string;
  corridor: string;
  work: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In review' | 'Scheduled' | 'Ready';
};

const navigation: { label: string; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Maintenance Planning', icon: CalendarClock },
  { label: 'Network', icon: MapPinned },
  { label: 'Assets', icon: TrainFront },
  { label: 'Alerts', icon: Siren },
  { label: 'Analytics', icon: LineChart },
  { label: 'Settings', icon: Settings },
];

const tasks: MaintenanceTask[] = [
  { id: 'MT-2048', asset: 'Turnout 14B', corridor: 'Northline · km 42.8', work: 'Point machine inspection', due: 'Today, 18:30', priority: 'High', status: 'In review' },
  { id: 'MT-2039', asset: 'Signal N-118', corridor: 'Northline · km 39.1', work: 'Relay cabinet replacement', due: 'Tomorrow, 06:00', priority: 'Medium', status: 'Scheduled' },
  { id: 'MT-2031', asset: 'Bridge 07', corridor: 'East Junction · km 18.4', work: 'Bearing visual inspection', due: '14 Oct 2025', priority: 'Medium', status: 'Ready' },
  { id: 'MT-2027', asset: 'Catenary C-221', corridor: 'Coastal · km 77.2', work: 'Contact wire tension check', due: '16 Oct 2025', priority: 'Low', status: 'Scheduled' },
];

const alertData = [
  { id: 'AL-701', level: 'Critical', title: 'Turnout 14B exceeded inspection threshold', detail: 'Northline corridor · 12 minutes ago', color: 'critical' },
  { id: 'AL-698', level: 'Watch', title: 'Brake wear trend rising on fleet set 08', detail: 'Depot West · 47 minutes ago', color: 'watch' },
  { id: 'AL-694', level: 'Info', title: 'Night access window confirmed for East Junction', detail: 'Possession planning · 2 hours ago', color: 'info' },
];

function StatusDot({ state }: { state: ConnectionState }) {
  const isLoading = state === 'loading';
  const isConnected = state === 'connected';
  return (
    <span className={`relative inline-flex h-2 w-2 shrink-0 rounded-full ${isLoading ? 'bg-[hsl(var(--accent))] railzen-status-pulse' : isConnected ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--destructive))]'}`} aria-hidden="true">
      {isConnected && <span className="absolute inset-0 rounded-full bg-[hsl(var(--primary))] opacity-40 animate-ping" />}
    </span>
  );
}

function StateLabel({ state }: { state: ConnectionState }) {
  const content = {
    loading: { label: 'Checking connection', className: 'text-[hsl(var(--accent))]' },
    connected: { label: 'Operational', className: 'text-[hsl(var(--primary))]' },
    'not-connected': { label: 'Connection issue', className: 'text-[hsl(var(--destructive))]' },
  }[state];
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] font-semibold ${content.className}`}>
      <StatusDot state={state} />
      {content.label}
    </span>
  );
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-3 animate-pulse rounded bg-[hsl(var(--muted))] ${className}`} />;
}

function KpiCard({ icon: Icon, label, value, change, trend, note, accent = 'teal' }: { icon: LucideIcon; label: string; value: string; change: string; trend: 'up' | 'down'; note: string; accent?: 'teal' | 'amber' | 'red' }) {
  const color = accent === 'amber' ? 'text-[hsl(var(--accent))] bg-[hsl(var(--accent)/.12)]' : accent === 'red' ? 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/.12)]' : 'text-[hsl(var(--primary))] bg-[hsl(var(--primary)/.12)]';
  return (
    <article className="railzen-panel railzen-reveal railzen-card group p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-lg p-2 ${color}`}><Icon className="h-4 w-4" /></div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] ${trend === 'down' ? 'bg-[hsl(var(--accent)/.1)] text-[hsl(var(--accent))]' : 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'}`}>
          {trend === 'down' ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
          {change}
        </span>
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[.13em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tracking-[-.04em] text-foreground">{value}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>
    </article>
  );
}

function Sparkline({ color, values }: { color: string; values: number[] }) {
  const points = values.map((value, index) => `${index * 18},${38 - value}`).join(' ');
  return (
    <svg viewBox="0 0 108 42" preserveAspectRatio="none" className="h-10 w-28" aria-label="trend chart">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="90" cy={38 - values[5]} r="2.5" fill={color} />
    </svg>
  );
}

function NetworkMap() {
  return (
    <div className="relative min-h-[290px] overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(216_31%_9%)]">
      <div className="pointer-events-none absolute inset-0 railzen-map-grid opacity-50" />
      <div className="absolute left-4 top-4 z-10">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Network schematic</p>
        <p className="mt-1 text-xs text-muted-foreground">Northline corridor · demo operating area</p>
      </div>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(216_27%_12%/.86)] px-3 py-2 text-[10px] text-muted-foreground backdrop-blur">
        <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" /> Healthy</span>
        <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /> Watch</span>
      </div>
      <svg viewBox="0 0 800 340" className="absolute inset-x-0 bottom-0 h-[82%] w-full" role="img" aria-label="Schematic map of the Northline and East Junction rail corridors">
        <path d="M58 275 C150 235 145 160 240 150 S335 77 430 105 S520 200 610 145 S690 84 760 57" fill="none" stroke="hsl(215 23% 25%)" strokeWidth="16" strokeLinecap="round" />
        <path d="M58 275 C150 235 145 160 240 150 S335 77 430 105 S520 200 610 145 S690 84 760 57" fill="none" stroke="hsl(173 45% 35%)" strokeWidth="2" strokeDasharray="8 5" />
        <path d="M174 308 C210 255 271 258 302 211 S394 161 447 193 S530 287 620 252" fill="none" stroke="hsl(215 23% 25%)" strokeWidth="12" strokeLinecap="round" />
        <path d="M174 308 C210 255 271 258 302 211 S394 161 447 193 S530 287 620 252" fill="none" stroke="hsl(201 65% 55%)" strokeWidth="2" strokeDasharray="7 5" />
        {[
          [58, 275, 'Central Yard', 'teal'], [147, 196, 'North Depot', 'teal'], [240, 150, 'N-118', 'teal'],
          [337, 91, 'Summit', 'amber'], [430, 105, '14B', 'red'], [523, 188, 'East Jct', 'teal'],
          [610, 145, 'Harbor', 'teal'], [760, 57, 'Coastal Gate', 'teal'], [302, 211, 'Bridge 07', 'amber'],
          [447, 193, 'C-221', 'teal'], [620, 252, 'West Loop', 'teal'],
        ].map(([x, y, label, color]) => (
          <g key={`${x}-${y}`} className="group">
            <circle cx={x as number} cy={y as number} r="8" fill={color === 'red' ? 'hsl(8 70% 60%/.18)' : color === 'amber' ? 'hsl(35 77% 58%/.16)' : 'hsl(173 68% 46%/.14)'} />
            <circle cx={x as number} cy={y as number} r="3.2" fill={color === 'red' ? 'hsl(8 70% 60%)' : color === 'amber' ? 'hsl(35 77% 58%)' : 'hsl(173 68% 46%)'} />
            <text x={(x as number) + 10} y={(y as number) - 10} fill="hsl(214 14% 70%)" fontSize="10" fontFamily="DM Mono, monospace">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Home() {
  const railzen = useRailzenHealth();
  const platform = useHealthCheck();
  const [activeNav, setActiveNav] = useState('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [period, setPeriod] = useState('This month');
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [scheduledTask, setScheduledTask] = useState<string[]>([]);

  const isLoading = railzen.isLoading || platform.isLoading;
  const isConnected = railzen.isSuccess && platform.isSuccess;
  const connectionState: ConnectionState = isLoading ? 'loading' : isConnected ? 'connected' : 'not-connected';
  const retryAll = () => {
    void railzen.refetch();
    void platform.refetch();
  };
  const visibleAlerts = alertData.filter((alert) => !dismissedAlerts.includes(alert.id)).slice(0, showAllAlerts ? 3 : 2);
  const navTitle = activeNav === 'Overview' ? 'Network overview' : activeNav;

  const handleNav = (label: string) => {
    setActiveNav(label);
    setMobileNavOpen(false);
  };

  return (
    <main className="railzen-page flex min-h-[100dvh] bg-background">
      <aside className="hidden w-[246px] shrink-0 flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-4 py-5 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="railzen-mark flex h-9 w-9 items-center justify-center rounded-xl text-[hsl(var(--primary))]"><Route className="h-5 w-5" strokeWidth={2.5} /></div>
          <div>
            <p className="font-display text-[15px] font-bold tracking-[-.035em] text-foreground">RailZen <span className="text-[hsl(var(--primary))]">AI</span></p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Control workspace</p>
          </div>
        </div>
        <div className="mt-9 px-2">
          <p className="font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">Workspace</p>
          <button type="button" className="mt-2 flex w-full items-center justify-between rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] px-3 py-2.5 text-left hover:border-[hsl(var(--primary)/.45)]">
            <span><span className="block text-xs font-semibold text-foreground">Northline Region</span><span className="mt-0.5 block font-mono text-[9px] text-muted-foreground">DEMO OPERATING AREA</span></span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        <nav className="mt-8 flex-1" aria-label="Primary navigation">
          <p className="px-2 font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">Operations</p>
          <div className="mt-2 space-y-1">
            {navigation.map(({ label, icon: Icon }) => (
              <button key={label} type="button" onClick={() => handleNav(label)} className={`railzen-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-colors ${activeNav === label ? 'is-active text-foreground' : 'text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground'}`}>
                <Icon className="h-4 w-4 shrink-0" strokeWidth={activeNav === label ? 2.2 : 1.8} />
                {label}
                {label === 'Alerts' && <span className="ml-auto rounded-full bg-[hsl(var(--destructive)/.14)] px-1.5 py-0.5 font-mono text-[9px] text-[hsl(var(--destructive))]">03</span>}
              </button>
            ))}
          </div>
        </nav>
        <div className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] p-3.5">
          <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Data mode</span><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /></div>
          <p className="mt-2 text-[11px] font-medium leading-5 text-foreground">Demonstration data only</p>
          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">Not connected to a government or railway authority feed.</p>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-[hsl(var(--sidebar-border))] px-2 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/.16)] font-mono text-[10px] font-medium text-[hsl(var(--primary))]">AM</div>
          <div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">Asha Menon</p><p className="truncate text-[10px] text-muted-foreground">Planning lead</p></div>
          <button type="button" className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Open profile"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="railzen-mobile-drawer fixed inset-0 z-40 bg-[hsl(var(--background)/.78)] backdrop-blur-sm lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <aside className="flex h-full w-[min(82vw,290px)] flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-4 py-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="railzen-mark flex h-9 w-9 items-center justify-center rounded-xl text-[hsl(var(--primary))]"><Route className="h-5 w-5" /></div><p className="font-display text-[15px] font-bold text-foreground">RailZen <span className="text-[hsl(var(--primary))]">AI</span></p></div><button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X className="h-5 w-5 text-muted-foreground" /></button></div>
            <nav className="mt-10 flex-1 space-y-1" aria-label="Mobile navigation">
              {navigation.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => handleNav(label)} className={`railzen-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-semibold ${activeNav === label ? 'is-active text-foreground' : 'text-muted-foreground'}`}><Icon className="h-4 w-4" />{label}</button>)}
            </nav>
            <p className="border-t border-[hsl(var(--sidebar-border))] pt-4 font-mono text-[9px] uppercase leading-5 tracking-[.14em] text-muted-foreground">DEMO DATA<br />Not a live railway feed</p>
          </aside>
        </div>
      )}

      <section className="min-w-0 flex-1">
        <header className="railzen-topbar sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.88)] px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0"><div className="flex items-center gap-2"><span className="hidden font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground sm:inline">Control room</span><span className="hidden h-1 w-1 rounded-full bg-[hsl(var(--border))] sm:inline" /><h1 className="truncate font-display text-base font-bold tracking-[-.025em] text-foreground sm:text-lg">{navTitle}</h1></div><p data-testid="text-purpose" className="mt-1 hidden truncate text-[11px] text-muted-foreground sm:block">AI-Powered Railway Maintenance Planning &amp; Optimization</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-1.5 sm:flex"><StatusDot state={connectionState} /><span className="text-[11px] font-medium text-muted-foreground">{connectionState === 'connected' ? 'Services operational' : connectionState === 'loading' ? 'Checking services' : 'Services offline'}</span></div>
            <div className="relative">
              <button type="button" onClick={() => setNoticeOpen((open) => !open)} className="relative rounded-lg p-2 text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground" aria-label="View notifications"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /></button>
              {noticeOpen && <div className="railzen-popover absolute right-0 top-11 z-40 w-72 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--popover))] p-3 shadow-[var(--shadow-md)]"><div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3"><p className="text-xs font-semibold text-foreground">Notifications</p><span className="font-mono text-[9px] text-[hsl(var(--accent))]">03 UNREAD</span></div><p className="py-4 text-xs leading-5 text-muted-foreground">Turnout 14B needs planner review before the 18:30 access window.</p><button type="button" onClick={() => setNoticeOpen(false)} className="text-[11px] font-semibold text-[hsl(var(--primary))]">Mark view complete</button></div>}
            </div>
            <div className="relative">
              <button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-lg p-1.5 pr-2 hover:bg-[hsl(var(--secondary))]" aria-label="Open user menu"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/.16)] font-mono text-[10px] font-medium text-[hsl(var(--primary))]">AM</span><span className="hidden text-left sm:block"><span className="block text-[11px] font-semibold text-foreground">Asha Menon</span><span className="block text-[9px] text-muted-foreground">Planner</span></span><ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" /></button>
              {profileOpen && <div className="railzen-popover absolute right-0 top-12 z-40 w-44 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--popover))] p-1.5 shadow-[var(--shadow-md)]"><button type="button" onClick={() => { setActiveNav('Settings'); setProfileOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground">Workspace settings</button><button type="button" onClick={() => setProfileOpen(false)} className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground">Close menu</button></div>}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1640px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" /><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">Tuesday · 14 October 2025</p></div><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">Good morning, Asha</h2><p className="mt-1 text-xs text-muted-foreground">Here is the operating picture for the Northline region.</p></div>
            <div className="flex items-center gap-2"><label className="relative"><span className="sr-only">Reporting period</span><select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-9 appearance-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-0 pl-3 pr-8 text-xs font-medium text-foreground"><option>This month</option><option>Last 30 days</option><option>This quarter</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-muted-foreground" /></label><button type="button" onClick={() => document.getElementById('maintenance-plan')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-3.5 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5"><SlidersHorizontal className="h-3.5 w-3.5" /> Plan work</button></div>
          </div>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Network key performance indicators">
            <KpiCard icon={ShieldCheck} label="Network health" value="94.7%" change="+2.8%" trend="up" note="vs. previous period" />
            <KpiCard icon={ListChecks} label="Active maintenance" value="18" change="4 due" trend="down" note="next 48 hours" accent="amber" />
            <KpiCard icon={Siren} label="Critical alerts" value="03" change="+1" trend="down" note="needs attention" accent="red" />
            <KpiCard icon={AlertTriangle} label="Assets at risk" value="07" change="-2" trend="up" note="in monitored state" accent="amber" />
            <KpiCard icon={PackageCheck} label="Planned / completed" value="78 / 64" change="82%" trend="up" note="completion this month" />
            <KpiCard icon={Gauge} label="Maintenance efficiency" value="91.3%" change="+4.1%" trend="up" note="planned hours recovered" />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(285px,.55fr)]">
            <article className="railzen-panel railzen-reveal railzen-reveal-delay-1 p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-[hsl(var(--primary))]" /><h3 className="text-sm font-bold text-foreground">Network operating picture</h3><span className="rounded bg-[hsl(var(--primary)/.1)] px-1.5 py-0.5 font-mono text-[9px] text-[hsl(var(--primary))]">DEMO</span></div><p className="mt-1 pl-6 text-xs text-muted-foreground">Live-like schematic view of monitored routes and asset condition</p></div><button type="button" onClick={() => handleNav('Network')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground">Open network <ArrowUpRight className="h-3 w-3" /></button></div>
              <NetworkMap />
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><div className="railzen-stat"><span>Trains monitored</span><strong>42</strong><em className="text-[hsl(var(--primary))]">+3 today</em></div><div className="railzen-stat"><span>Route availability</span><strong>98.2%</strong><em className="text-[hsl(var(--primary))]">+0.6%</em></div><div className="railzen-stat"><span>Open work zones</span><strong>05</strong><em className="text-[hsl(var(--accent))]">2 tonight</em></div><div className="railzen-stat"><span>Last telemetry</span><strong>08:42</strong><em>2 min ago</em></div></div>
            </article>
            <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
              <div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">System pulse</p><h3 className="mt-1.5 text-sm font-bold text-foreground">Operational status</h3></div><Activity className="h-4 w-4 text-[hsl(var(--primary))]" /></div>
              <div data-testid="status-backend-connection" className="mt-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-3.5"><div className="flex items-center justify-between"><StateLabel state={connectionState} /><span className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">Updated 08:42</span></div>{isLoading ? <div className="mt-3 space-y-2"><SkeletonLine className="w-40" /><SkeletonLine className="w-28" /></div> : <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{isConnected ? 'RailZen services and platform telemetry are responding normally.' : 'The service could not be reached. Retry when the operating connection is available.'}</p>}{!isLoading && !isConnected && <button type="button" data-testid="button-retry-connection" onClick={retryAll} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[hsl(var(--border))] px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-[hsl(var(--secondary))]"><RefreshCw className="h-3.5 w-3.5" /> Retry connection</button>}</div>
              <div className="mt-3 space-y-2"><div data-testid="status-railzen-service" className="flex items-center justify-between rounded-lg px-1 py-2"><span className="flex items-center gap-2 text-[11px] text-muted-foreground"><Radio className="h-3.5 w-3.5" /> RailZen service</span>{railzen.isLoading ? <SkeletonLine className="w-10" /> : <span className={`font-mono text-[9px] uppercase ${railzen.isSuccess ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]'}`}>{railzen.isSuccess ? railzen.data?.status ?? 'ok' : 'offline'}</span>}</div><div data-testid="status-platform-service" className="flex items-center justify-between rounded-lg px-1 py-2"><span className="flex items-center gap-2 text-[11px] text-muted-foreground"><Zap className="h-3.5 w-3.5" /> Platform telemetry</span>{platform.isLoading ? <SkeletonLine className="w-10" /> : <span className={`font-mono text-[9px] uppercase ${platform.isSuccess ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]'}`}>{platform.isSuccess ? platform.data?.status ?? 'ok' : 'offline'}</span>}</div></div>
              <div className="mt-5 border-t border-[hsl(var(--border))] pt-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-foreground">Route availability</p><span className="font-mono text-xs text-[hsl(var(--primary))]">98.2%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--secondary))]"><div className="h-full w-[98.2%] rounded-full bg-[hsl(var(--primary))]" /></div><p className="mt-2 text-[10px] text-muted-foreground">No access restrictions on passenger routes.</p></div>
            </article>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]">
            <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
              <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h3 className="text-sm font-bold text-foreground">Maintenance throughput</h3><span className="rounded bg-[hsl(var(--secondary))] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">{period.toUpperCase()}</span></div><p className="mt-1 text-xs text-muted-foreground">Planned work compared with completed work orders</p></div><button type="button" onClick={() => handleNav('Analytics')} className="text-muted-foreground hover:text-foreground" aria-label="Open maintenance analytics"><MoreHorizontal className="h-4 w-4" /></button></div>
              <div className="mt-6 grid grid-cols-[1fr_auto] gap-6"><div className="flex h-[150px] items-end justify-between gap-2 border-b border-l border-[hsl(var(--border))] px-3 pb-0 pt-4">{[['Jun', 62, 45], ['Jul', 72, 58], ['Aug', 68, 61], ['Sep', 84, 70], ['Oct', 78, 64]].map(([month, planned, complete]) => <div key={month} className="flex h-full flex-1 items-end justify-center gap-1.5"><div className="w-3 rounded-t-sm bg-[hsl(var(--primary)/.3)]" style={{ height: `${planned as number}%` }} title={`${month} planned`} /><div className="w-3 rounded-t-sm bg-[hsl(var(--primary))]" style={{ height: `${complete as number}%` }} title={`${month} completed`} /></div>)}</div><div className="flex flex-col justify-center gap-4 text-[10px] text-muted-foreground"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-sm bg-[hsl(var(--primary)/.3)]" /> Planned</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-sm bg-[hsl(var(--primary))]" /> Completed</span><strong className="font-display text-2xl text-foreground">82<span className="text-sm text-muted-foreground">%</span></strong><span>completion rate</span></div></div><div className="mt-2 flex justify-around pl-3 text-[10px] text-muted-foreground"><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
            </article>
            <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 p-4 sm:p-5">
              <div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Condition trend</p><h3 className="mt-1.5 text-sm font-bold text-foreground">Maintenance efficiency</h3></div><button type="button" onClick={() => setPeriod(period === 'This month' ? 'Last 30 days' : 'This month')} className="rounded-md border border-[hsl(var(--border))] px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground">{period === 'This month' ? '30 days' : 'Month'}</button></div>
              <div className="mt-5 flex items-end justify-between"><div><p className="font-display text-4xl font-bold tracking-[-.06em] text-foreground">91.3<span className="text-lg text-[hsl(var(--primary))]">%</span></p><p className="mt-1 flex items-center gap-1 text-[11px] text-[hsl(var(--primary))]"><ArrowUpRight className="h-3 w-3" /> 4.1% from prior period</p></div><Sparkline color="hsl(173 68% 46%)" values={[9, 16, 11, 27, 24, 34]} /></div>
              <div className="mt-6 space-y-3"><div><div className="mb-1.5 flex justify-between text-[10px]"><span className="text-muted-foreground">Preventive completion</span><span className="font-mono text-foreground">88%</span></div><div className="h-1.5 rounded-full bg-[hsl(var(--secondary))]"><div className="h-full w-[88%] rounded-full bg-[hsl(var(--primary))]" /></div></div><div><div className="mb-1.5 flex justify-between text-[10px]"><span className="text-muted-foreground">First-time fix rate</span><span className="font-mono text-foreground">76%</span></div><div className="h-1.5 rounded-full bg-[hsl(var(--secondary))]"><div className="h-full w-[76%] rounded-full bg-[hsl(var(--chart-3))]" /></div></div></div>
            </article>
          </section>

          <section id="maintenance-plan" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
            <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 overflow-hidden p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><Wrench className="h-4 w-4 text-[hsl(var(--primary))]" /><h3 className="text-sm font-bold text-foreground">Maintenance tasks</h3><span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5 font-mono text-[9px] text-muted-foreground">18 OPEN</span></div><p className="mt-1 pl-6 text-xs text-muted-foreground">Prioritized work orders for the next access windows</p></div><button type="button" onClick={() => handleNav('Maintenance Planning')} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground">View maintenance plan <ArrowUpRight className="h-3 w-3" /></button></div>
              <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-[hsl(var(--border))] font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground"><th className="pb-3 pl-2 font-medium">Asset / corridor</th><th className="pb-3 font-medium">Work scope</th><th className="pb-3 font-medium">Due</th><th className="pb-3 font-medium">Priority</th><th className="pb-3 pr-2 text-right font-medium">Status</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className="border-b border-[hsl(var(--border)/.65)] last:border-0 hover:bg-[hsl(var(--secondary)/.35)]"><td className="py-3 pl-2"><button type="button" onClick={() => setSelectedTask(task)} className="text-left"><span className="block text-xs font-semibold text-foreground hover:text-[hsl(var(--primary))]">{task.asset}</span><span className="mt-1 block font-mono text-[10px] text-muted-foreground">{task.corridor}</span></button></td><td className="py-3 text-xs text-muted-foreground">{task.work}<span className="mt-1 block font-mono text-[9px] text-[hsl(var(--muted-foreground))]">{task.id}</span></td><td className="py-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Clock3 className="h-3 w-3" />{task.due}</span></td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${task.priority === 'High' ? 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]' : task.priority === 'Medium' ? 'bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]' : 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'}`}>{task.priority}</span></td><td className="py-3 pr-2 text-right"><button type="button" onClick={() => setSelectedTask(task)} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground"><span className={`h-1.5 w-1.5 rounded-full ${scheduledTask.includes(task.id) || task.status === 'Scheduled' ? 'bg-[hsl(var(--primary))]' : task.status === 'Ready' ? 'bg-[hsl(var(--chart-3))]' : 'bg-[hsl(var(--accent))]'}`} />{scheduledTask.includes(task.id) ? 'Scheduled' : task.status}</button></td></tr>)}</tbody></table></div>
            </article>
            <article className="railzen-panel railzen-reveal railzen-reveal-delay-4 p-4 sm:p-5">
              <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><Siren className="h-4 w-4 text-[hsl(var(--destructive))]" /><h3 className="text-sm font-bold text-foreground">Priority alerts</h3></div><p className="mt-1 pl-6 text-xs text-muted-foreground">Signals requiring planner review</p></div><button type="button" onClick={() => setShowAllAlerts((show) => !show)} className="text-[11px] font-semibold text-[hsl(var(--primary))]">{showAllAlerts ? 'Collapse' : 'View all'}</button></div>
              <div className="mt-5 space-y-3">{visibleAlerts.map((alert) => <div key={alert.id} className="group relative rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.3)] p-3"><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${alert.color === 'critical' ? 'bg-[hsl(var(--destructive))]' : alert.color === 'watch' ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--chart-3))]'}`} /><div className="min-w-0"><p className="text-xs font-semibold leading-5 text-foreground">{alert.title}</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{alert.detail}</p></div></div><button type="button" onClick={() => setDismissedAlerts((current) => [...current, alert.id])} className="absolute right-2 top-2 hidden rounded p-1 text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground group-hover:block" aria-label={`Dismiss ${alert.id}`}><X className="h-3 w-3" /></button></div>)}{visibleAlerts.length === 0 && <div className="rounded-lg border border-dashed border-[hsl(var(--border))] p-6 text-center"><CheckCircle2 className="mx-auto h-5 w-5 text-[hsl(var(--primary))]" /><p className="mt-2 text-xs font-semibold text-foreground">No priority alerts</p><p className="mt-1 text-[10px] text-muted-foreground">Your review queue is clear.</p></div>}</div>
              <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4"><span className="flex items-center gap-2 text-[10px] text-muted-foreground"><Search className="h-3.5 w-3.5" /> Alert window: last 24 hours</span><button type="button" onClick={() => handleNav('Alerts')} className="font-mono text-[10px] text-[hsl(var(--primary))]">Open queue</button></div>
            </article>
          </section>

          <footer className="mt-8 flex flex-col gap-2 border-t border-[hsl(var(--border))] py-5 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span className="font-mono uppercase tracking-[.14em]">RailZen AI · Northline operating workspace</span><span>DEMO DATA · Not a live government or railway authority feed</span></footer>
        </div>
      </section>

      {selectedTask && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--background)/.8)] p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Maintenance task details"><div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--popover))] p-5 shadow-[var(--shadow-md)]"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">{selectedTask.id}</p><h3 className="mt-2 font-display text-lg font-bold text-foreground">{selectedTask.asset}</h3><p className="mt-1 text-xs text-muted-foreground">{selectedTask.work}</p></div><button type="button" onClick={() => setSelectedTask(null)} aria-label="Close task details" className="rounded-lg p-1 text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"><X className="h-4 w-4" /></button></div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-lg bg-[hsl(var(--secondary)/.6)] p-3"><p className="font-mono text-[9px] uppercase text-muted-foreground">Corridor</p><p className="mt-1 text-xs text-foreground">{selectedTask.corridor}</p></div><div className="rounded-lg bg-[hsl(var(--secondary)/.6)] p-3"><p className="font-mono text-[9px] uppercase text-muted-foreground">Access window</p><p className="mt-1 text-xs text-foreground">{selectedTask.due}</p></div></div><p className="mt-5 text-xs leading-5 text-muted-foreground">Review this work order with the route controller before assigning a possession window.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setSelectedTask(null)} className="rounded-lg border border-[hsl(var(--border))] px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-[hsl(var(--secondary))]">Close</button><button type="button" onClick={() => { setScheduledTask((current) => current.includes(selectedTask.id) ? current : [...current, selectedTask.id]); setSelectedTask(null); }} className="rounded-lg bg-[hsl(var(--primary))] px-3.5 py-2 text-xs font-bold text-[hsl(var(--primary-foreground))]">{scheduledTask.includes(selectedTask.id) ? 'Already scheduled' : 'Mark scheduled'}</button></div></div></div>}
    </main>
  );
}

export default Home;