import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Gauge,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const metrics = [
  {
    label: 'Maintenance completion',
    value: '82%',
    change: '+6.4%',
    trend: 'up',
    detail: 'vs previous period',
  },
  {
    label: 'Network availability',
    value: '98.2%',
    change: '+0.6%',
    trend: 'up',
    detail: 'vs previous period',
  },
  {
    label: 'Average response time',
    value: '42 min',
    change: '-8.1%',
    trend: 'up',
    detail: 'faster than previous period',
  },
  {
    label: 'Open backlog',
    value: '08',
    change: '-2',
    trend: 'up',
    detail: 'open work orders',
  },
];

const corridorData = [
  {
    name: 'Northline Main',
    availability: 99.1,
    workload: 71,
    health: 94,
  },
  {
    name: 'East Junction',
    availability: 97.8,
    workload: 84,
    health: 82,
  },
  {
    name: 'Coastal Corridor',
    availability: 98.6,
    workload: 63,
    health: 91,
  },
];

function Analytics() {
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Performance analytics
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Operations analytics
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Track maintenance performance, network reliability, and operational workload.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          CURRENT PERIOD
        </span>
      </div>

      <section className="railzen-reveal railzen-reveal-delay-1 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="railzen-panel railzen-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
                {metric.label}
              </p>

              {metric.trend === 'up' ? (
                <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              )}
            </div>

            <p className="mt-3 font-display text-2xl font-bold tracking-[-.04em] text-foreground">
              {metric.value}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-[hsl(var(--primary))]">
                {metric.change}
              </span>
              <span className="text-[10px] text-muted-foreground">{metric.detail}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Performance trend</h3>
              </div>

              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Maintenance completion across the current workspace period
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground"
            >
              Detailed analysis <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                  Completion
                </p>
                <p className="mt-1 font-display text-3xl font-bold tracking-[-.045em] text-foreground">
                  82%
                </p>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[.11em] text-[hsl(var(--primary))]">
                +6.4% period over period
              </span>
            </div>

            <div className="mt-6 flex h-[190px] items-end gap-2 border-b border-l border-[hsl(var(--border))] px-3 pb-0 pt-5 sm:gap-3">
              {[48, 54, 51, 63, 66, 61, 72, 76, 82].map((height, index) => (
                <div
                  key={index}
                  className="group flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    className="w-full rounded-t-md bg-[hsl(var(--primary)/.72)] transition-all group-hover:bg-[hsl(var(--primary))]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="mt-2 text-center font-mono text-[8px] text-muted-foreground">
                    W{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
                Reliability
              </p>
              <h3 className="mt-1.5 text-sm font-bold text-foreground">
                Key indicators
              </h3>
            </div>

            <Gauge className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>

          <div className="mt-5 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Network availability
                </span>
                <span className="font-mono text-[10px] font-semibold text-foreground">
                  98.2%
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[hsl(var(--secondary))]">
                <div className="h-full w-[98.2%] rounded-full bg-[hsl(var(--primary))]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Planned maintenance
                </span>
                <span className="font-mono text-[10px] font-semibold text-foreground">
                  76%
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[hsl(var(--secondary))]">
                <div className="h-full w-[76%] rounded-full bg-[hsl(var(--accent))]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Response target
                </span>
                <span className="font-mono text-[10px] font-semibold text-foreground">
                  88%
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[hsl(var(--secondary))]">
                <div className="h-full w-[88%] rounded-full bg-[hsl(var(--primary))]" />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <p className="text-[10px] font-semibold text-foreground">
                Overall signal
              </p>
            </div>

            <p className="mt-2 text-xs font-semibold text-foreground">
              Operational performance is trending positively.
            </p>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              Network availability and maintenance completion remain above the workspace review
              thresholds.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-5">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 overflow-hidden p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Corridor performance</h3>
              </div>

              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Compare reliability, workload, and asset health by operating segment
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                  <th className="pb-3 pl-2 font-medium">Corridor</th>
                  <th className="pb-3 font-medium">Availability</th>
                  <th className="pb-3 font-medium">Maintenance load</th>
                  <th className="pb-3 font-medium">Asset health</th>
                  <th className="pb-3 pr-2 text-right font-medium">Signal</th>
                </tr>
              </thead>

              <tbody>
                {corridorData.map((corridor) => {
                  const signal =
                    corridor.health < 85
                      ? 'Watch'
                      : corridor.workload > 80
                        ? 'Busy'
                        : 'Healthy';

                  return (
                    <tr
                      key={corridor.name}
                      className="border-b border-[hsl(var(--border)/.65)] last:border-0 hover:bg-[hsl(var(--secondary)/.35)]"
                    >
                      <td className="py-3 pl-2">
                        <span className="text-xs font-semibold text-foreground">
                          {corridor.name}
                        </span>
                      </td>

                      <td className="py-3">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {corridor.availability}%
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-[hsl(var(--secondary))]">
                            <div
                              className="h-full rounded-full bg-[hsl(var(--accent))]"
                              style={{ width: `${corridor.workload}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {corridor.workload}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-[hsl(var(--secondary))]">
                            <div
                              className="h-full rounded-full bg-[hsl(var(--primary))]"
                              style={{ width: `${corridor.health}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {corridor.health}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 pr-2 text-right">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            signal === 'Watch'
                              ? 'bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]'
                              : signal === 'Busy'
                                ? 'bg-[hsl(var(--secondary))] text-foreground'
                                : 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                          }`}
                        >
                          {signal}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </RailzenShell>
  );
}

export default Analytics;