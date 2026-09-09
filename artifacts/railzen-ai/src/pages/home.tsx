import { useHealthCheck, useRailzenHealth } from '@workspace/api-client-react';
import { Activity, ArrowUpRight, Check, CircleAlert, Radio, RefreshCw, Route, Signal, Sparkles } from 'lucide-react';

type ConnectionState = 'loading' | 'connected' | 'not-connected';

function StatusDot({ state }: { state: ConnectionState }) {
  const isLoading = state === 'loading';
  const isConnected = state === 'connected';

  return (
    <span
      aria-hidden="true"
      className={[
        'relative inline-flex h-2.5 w-2.5 shrink-0 rounded-full',
        isLoading ? 'bg-amber-500 railzen-status-pulse' : isConnected ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--destructive))]',
      ].join(' ')}
    >
      {isConnected && <span className="absolute inset-0 rounded-full bg-[hsl(var(--primary))] opacity-25 animate-ping" />}
    </span>
  );
}

function StateLabel({ state }: { state: ConnectionState }) {
  const content = {
    loading: { label: 'Checking connection', className: 'text-amber-700' },
    connected: { label: 'Connected', className: 'text-[hsl(var(--primary))]' },
    'not-connected': { label: 'Not connected', className: 'text-[hsl(var(--destructive))]' },
  }[state];

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold tracking-wide ${content.className}`}>
      <StatusDot state={state} />
      {content.label}
    </span>
  );
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-3 animate-pulse rounded-full bg-[hsl(var(--muted))] ${className}`} />;
}

function Home() {
  const railzen = useRailzenHealth();
  const platform = useHealthCheck();

  const isLoading = railzen.isLoading || platform.isLoading;
  const isConnected = railzen.isSuccess && platform.isSuccess;
  const connectionState: ConnectionState = isLoading ? 'loading' : isConnected ? 'connected' : 'not-connected';

  const retryAll = () => {
    void railzen.refetch();
    void platform.refetch();
  };

  return (
    <main className="railzen-page min-h-[100dvh] bg-background">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        <header className="railzen-reveal flex items-center justify-between gap-5 border-b border-border/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[hsl(var(--sidebar))] text-[hsl(var(--primary))] shadow-sm">
              <Route className="h-5 w-5" strokeWidth={2.4} />
              <span className="absolute bottom-1.5 left-2 h-px w-6 bg-[hsl(var(--accent))]" />
            </div>
            <div>
              <p className="font-[var(--app-font-sans)] text-sm font-extrabold tracking-[-0.02em] text-foreground">RailZen AI</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Operations foundation</p>
            </div>
          </div>
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">System status</span>
            <StateLabel state={connectionState} />
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          <section className="grid flex-1 grid-cols-1 gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(330px,.85fr)] lg:items-center lg:gap-20 lg:pb-24 lg:pt-20">
            <div className="max-w-3xl">
              <div className="railzen-reveal railzen-reveal-delay-1 mb-7 flex items-center gap-3">
                <span className="rounded-full border border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent)/.1)] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--accent-foreground))]">
                  PRD 0 — Prototype
                </span>
                <span className="h-px w-10 bg-border" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">01 / 01</span>
              </div>

              <h1 className="railzen-reveal railzen-reveal-delay-1 max-w-4xl font-[var(--app-font-sans)] text-[clamp(3.5rem,8.5vw,8.25rem)] font-extrabold leading-[.91] tracking-[-0.075em] text-foreground">
                RailZen
                <span className="block text-[hsl(var(--primary))]">AI.</span>
              </h1>
              <div className="railzen-rule mt-8 w-24" />
              <p data-testid="text-purpose" className="railzen-reveal railzen-reveal-delay-2 mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Railway Maintenance Block Planning &amp; Optimization
                <span className="mt-2 block text-base leading-7 text-foreground/80">
                  A future-facing operations tool for railway maintenance planners.
                </span>
              </p>
            </div>

            <div className="railzen-reveal railzen-reveal-delay-2 relative">
              <div className="railzen-grid absolute -inset-5 -z-10 rounded-[2rem] opacity-60" />
              <div className="rounded-[1.45rem] border border-border bg-card/90 p-5 shadow-[var(--shadow-md)] backdrop-blur-sm sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Foundation monitor</p>
                    <h2 className="mt-2 text-lg font-bold tracking-[-0.03em] text-foreground">Backend connectivity</h2>
                  </div>
                  <div className="rounded-lg bg-secondary p-2.5 text-[hsl(var(--primary))]">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>

                <div data-testid="status-backend-connection" className="py-6">
                  <StateLabel state={connectionState} />
                  {isLoading ? (
                    <div className="mt-4 space-y-2">
                      <SkeletonLine className="w-48" />
                      <SkeletonLine className="w-64" />
                    </div>
                  ) : isConnected ? (
                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                      RailZen AI services are responding. The foundation is ready for the next phase.
                    </p>
                  ) : (
                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                      The backend could not be reached. Check the service and try again.
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 border-t border-border pt-4">
                  <div data-testid="status-railzen-service" className="flex items-center justify-between gap-4 rounded-lg bg-secondary/60 px-3.5 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Radio className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs font-semibold text-foreground">RailZen service</span>
                    </div>
                    {railzen.isLoading ? (
                      <SkeletonLine className="w-14" />
                    ) : railzen.isSuccess ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--primary))]">{railzen.data?.status ?? 'ok'}</span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--destructive))]">offline</span>
                    )}
                  </div>
                  <div data-testid="status-platform-service" className="flex items-center justify-between gap-4 rounded-lg bg-secondary/60 px-3.5 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Signal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs font-semibold text-foreground">Platform health</span>
                    </div>
                    {platform.isLoading ? (
                      <SkeletonLine className="w-14" />
                    ) : platform.isSuccess ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--primary))]">{platform.data?.status ?? 'ok'}</span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--destructive))]">offline</span>
                    )}
                  </div>
                </div>

                {!isLoading && !isConnected && (
                  <button
                    type="button"
                    data-testid="button-retry-connection"
                    onClick={retryAll}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry connection
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="railzen-reveal railzen-reveal-delay-3 grid grid-cols-1 gap-8 border-t border-border py-9 sm:grid-cols-3 sm:gap-8">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-[hsl(var(--primary)/.11)] p-2 text-[hsl(var(--primary))]">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Clear by design</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">A focused foundation, without simulated planning features.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-[hsl(var(--accent)/.15)] p-2 text-[hsl(var(--accent-foreground))]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Built for the next signal</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">The product surface will grow from a dependable core.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-secondary p-2 text-muted-foreground">
                <CircleAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Scope held intentionally</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">No dashboard, scheduling, or recommendation engine in Phase 0.1.</p>
              </div>
            </div>
          </section>
        </div>

        <footer className="railzen-reveal railzen-reveal-delay-4 flex flex-col gap-2 border-t border-border pt-5 text-[10px] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.16em] text-muted-foreground">Phase 0.1 — Project Foundation</p>
          <p className="flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-muted-foreground">
            <span>Railway operations, made clearer</span>
            <ArrowUpRight className="h-3 w-3" />
          </p>
        </footer>
      </div>
    </main>
  );
}

export default Home;