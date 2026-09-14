import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Wrench,
} from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const maintenanceTasks = [
  {
    id: 'MP-214',
    asset: 'Signal 14B',
    work: 'Inspection and relay test',
    window: 'Today · 18:30–20:00',
    crew: 'Signal team',
    status: 'Priority',
  },
  {
    id: 'MP-209',
    asset: 'Bridge 07',
    work: 'Joint inspection',
    window: '14 Oct · 09:00–11:30',
    crew: 'Structures',
    status: 'Scheduled',
  },
  {
    id: 'MP-202',
    asset: 'Track N118',
    work: 'Geometry verification',
    window: '16 Oct · 13:00–15:00',
    crew: 'Track team',
    status: 'Scheduled',
  },
  {
    id: 'MP-198',
    asset: 'Catenary C221',
    work: 'Visual inspection',
    window: '21 Oct · 08:00–10:00',
    crew: 'Electrical',
    status: 'Planned',
  },
];

function MaintenancePlanning() {
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Maintenance operations
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Maintenance planning
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Coordinate upcoming work against asset condition and available access windows.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 self-start rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground hover:bg-[hsl(var(--secondary))] sm:self-auto"
        >
          Planning view <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <section className="railzen-reveal railzen-reveal-delay-1 grid grid-cols-2 gap-3 md:grid-cols-4">
        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Open work
            </p>
            <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">08</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--accent))]">03 due this week</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Scheduled
            </p>
            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">06</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">access windows secured</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Priority work
            </p>
            <Clock3 className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">02</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--destructive))]">needs planner review</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Completion
            </p>
            <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">82%</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">current period</p>
        </article>
      </section>

      <section className="mt-5">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 overflow-hidden p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Upcoming maintenance</h3>
              </div>

              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Prioritized work based on timing, asset condition, and access availability
              </p>
            </div>

            <span className="rounded bg-[hsl(var(--secondary))] px-2 py-1 font-mono text-[9px] text-muted-foreground">
              {maintenanceTasks.length.toString().padStart(2, '0')} TASKS
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[840px] text-left">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                  <th className="pb-3 pl-2 font-medium">Work order</th>
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Work scope</th>
                  <th className="pb-3 font-medium">Access window</th>
                  <th className="pb-3 font-medium">Crew</th>
                  <th className="pb-3 pr-2 text-right font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {maintenanceTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-[hsl(var(--border)/.65)] last:border-0 hover:bg-[hsl(var(--secondary)/.35)]"
                  >
                    <td className="py-3 pl-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {task.id}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="text-xs font-semibold text-foreground">{task.asset}</span>
                    </td>

                    <td className="py-3 text-xs text-muted-foreground">{task.work}</td>

                    <td className="py-3 text-xs text-muted-foreground">{task.window}</td>

                    <td className="py-3 text-xs text-muted-foreground">{task.crew}</td>

                    <td className="py-3 pr-2 text-right">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          task.status === 'Priority'
                            ? 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]'
                            : task.status === 'Scheduled'
                              ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                              : 'bg-[hsl(var(--secondary))] text-muted-foreground'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
            Planner signal
          </p>
          <h3 className="mt-1.5 text-sm font-bold text-foreground">
            Best near-term intervention
          </h3>

          <div className="mt-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.13em] text-[hsl(var(--accent))]">
                  Priority
                </p>
                <p className="mt-1 text-xs font-semibold text-foreground">
                  Signal 14B · inspection and relay test
                </p>
              </div>
              <Clock3 className="h-4 w-4 text-[hsl(var(--accent))]" />
            </div>

            <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
              The current access window offers a practical opportunity to address the asset before
              the next higher-traffic operating period.
            </p>
          </div>
        </article>

        <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
            Resource readiness
          </p>
          <h3 className="mt-1.5 text-sm font-bold text-foreground">
            Crew allocation
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="railzen-stat">
              <span>Signal team</span>
              <strong>Ready</strong>
              <em className="text-[hsl(var(--primary))]">18:30 window</em>
            </div>

            <div className="railzen-stat">
              <span>Structures</span>
              <strong>Ready</strong>
              <em>14 Oct</em>
            </div>

            <div className="railzen-stat">
              <span>Track team</span>
              <strong>Ready</strong>
              <em>16 Oct</em>
            </div>

            <div className="railzen-stat">
              <span>Electrical</span>
              <strong>Planned</strong>
              <em>21 Oct</em>
            </div>
          </div>
        </article>
      </section>
    </RailzenShell>
  );
}

export default MaintenancePlanning;