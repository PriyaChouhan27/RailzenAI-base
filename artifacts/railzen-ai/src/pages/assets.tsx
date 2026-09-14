import { ArrowUpRight, TrainFront } from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const assetData = [
  {
    id: 'TRK-N118',
    type: 'Track section',
    location: 'Northline · km 39.1',
    health: '96%',
    condition: 'Healthy',
    inspection: '07 Oct 2025',
    next: '21 Oct 2025',
    risk: 'Low',
  },
  {
    id: 'SIG-14B',
    type: 'Signal',
    location: 'Northline · km 42.8',
    health: '68%',
    condition: 'Watch',
    inspection: '02 Oct 2025',
    next: 'Today',
    risk: 'High',
  },
  {
    id: 'BRG-007',
    type: 'Bridge',
    location: 'East Junction · km 18.4',
    health: '82%',
    condition: 'Stable',
    inspection: '28 Sep 2025',
    next: '14 Oct 2025',
    risk: 'Medium',
  },
  {
    id: 'CAT-C221',
    type: 'Electrical system',
    location: 'Coastal · km 77.2',
    health: '91%',
    condition: 'Healthy',
    inspection: '30 Sep 2025',
    next: '16 Oct 2025',
    risk: 'Low',
  },
];

function Assets() {
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Asset monitoring
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Asset health overview
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Monitor infrastructure condition, inspection timing, and operational risk.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          {assetData.length} MONITORED
        </span>
      </div>

      <section className="railzen-reveal railzen-reveal-delay-1 grid grid-cols-2 gap-3 md:grid-cols-4">
        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Healthy assets
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">02</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">Stable condition</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Watch
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">01</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--accent))]">Needs review</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            High risk
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">01</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--destructive))]">Priority action</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
            Avg health
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">84.3%</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">Monitored fleet</p>
        </article>
      </section>

      <section className="mt-5">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 overflow-hidden p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrainFront className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Asset register</h3>
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Current condition and inspection schedule across monitored assets
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground"
            >
              Export view <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                  <th className="pb-3 pl-2 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Health</th>
                  <th className="pb-3 font-medium">Condition</th>
                  <th className="pb-3 font-medium">Last inspection</th>
                  <th className="pb-3 font-medium">Next inspection</th>
                  <th className="pb-3 pr-2 text-right font-medium">Risk</th>
                </tr>
              </thead>

              <tbody>
                {assetData.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-[hsl(var(--border)/.65)] last:border-0 hover:bg-[hsl(var(--secondary)/.35)]"
                  >
                    <td className="py-3 pl-2">
                      <span className="block text-xs font-semibold text-foreground">
                        {asset.id}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        {asset.type}
                      </span>
                    </td>

                    <td className="py-3 text-xs text-muted-foreground">{asset.location}</td>

                    <td className="py-3">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {asset.health}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-[10px] font-semibold text-foreground">
                        {asset.condition}
                      </span>
                    </td>

                    <td className="py-3 text-xs text-muted-foreground">{asset.inspection}</td>

                    <td className="py-3 text-xs text-muted-foreground">{asset.next}</td>

                    <td className="py-3 pr-2 text-right">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          asset.risk === 'High'
                            ? 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]'
                            : asset.risk === 'Medium'
                              ? 'bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]'
                              : 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                        }`}
                      >
                        {asset.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </RailzenShell>
  );
}

export default Assets;