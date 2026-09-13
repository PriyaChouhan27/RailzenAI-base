import { useState } from 'react';
import { ArrowUpRight, Siren } from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const alertData = [
  {
    id: 'AL-701',
    level: 'Critical',
    title: 'Signal 14B inspection overdue',
    detail: 'Inspection window has passed and requires planner review.',
    color: 'critical',
  },
  {
    id: 'AL-698',
    level: 'Watch',
    title: 'East Junction bridge health trending down',
    detail: 'Bridge 07 condition has declined 4 points since the previous review.',
    color: 'watch',
  },
  {
    id: 'AL-694',
    level: 'Info',
    title: 'Northline access window confirmed',
    detail: 'Maintenance access remains available for the next planning window.',
    color: 'info',
  },
];

function Alerts() {
      const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--accent))]">
              Operational alerts
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Alert queue
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Review active operational events requiring attention.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          {alertData.length} ACTIVE
        </span>
      </div>

      <section className="railzen-reveal railzen-reveal-delay-1 grid grid-cols-2 gap-3 md:grid-cols-4">
        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Critical
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">01</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--destructive))]">Immediate review</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Watch
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">01</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--accent))]">Monitor closely</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Informational
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">01</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">No action required</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Total active
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {alertData.length.toString().padStart(2, '0')}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Across network</p>
        </article>
      </section>

      <section className="mt-5">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Siren className="h-4 w-4 text-[hsl(var(--accent))]" />
                <h3 className="text-sm font-bold text-foreground">Active alerts</h3>
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Current events surfaced by the operating workspace
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAlert('ALERT-QUEUE')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground"
            >
              Review queue <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {alertData.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.color === 'critical'
                        ? 'bg-[hsl(var(--destructive))]'
                        : item.color === 'watch'
                          ? 'bg-[hsl(var(--accent))]'
                          : 'bg-[hsl(var(--primary))]'
                    }`}
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                        {item.id}
                      </span>
                      <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5 text-[9px] font-semibold text-foreground">
                        {item.level}
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-semibold text-foreground">{item.title}</h4>
                    <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>

               <button
  type="button"
  onClick={() => setSelectedAlert(item.id)}
  className="inline-flex shrink-0 items-center gap-1 self-start rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-[10px] font-semibold text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground sm:self-center"
>
                  Open alert <ArrowUpRight className="h-3 w-3" />
                </button>
              </article>
            ))}
          </div>
        </article>
      </section>

      {selectedAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--background)/.72)] p-4 backdrop-blur-sm"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="railzen-panel w-full max-w-md p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--accent))]">
              Alert detail
            </p>

            <h3 className="mt-2 text-sm font-bold text-foreground">
              {selectedAlert}
            </h3>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Detailed alert actions are available in this demonstration
              workspace. Review the event, confirm its operational impact, and
              coordinate the appropriate maintenance response.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="rounded-md border border-[hsl(var(--border))] px-3 py-2 text-[10px] font-semibold text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-[10px] font-semibold text-[hsl(var(--primary-foreground))]"
              >
                Mark reviewed
              </button>
            </div>
          </div>
        </div>
      )}

    </RailzenShell>

  );
}

export default Alerts;