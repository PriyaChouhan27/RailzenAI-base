import { Building2, Check, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';
import { useRailzenWorkspace } from '@/components/railzen-workspace';

function Settings() {
  const { network, setNetwork, period, setPeriod } = useRailzenWorkspace();
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Workspace configuration
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Workspace settings
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure the operating context and demonstration preferences.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          LOCAL SETTINGS
        </span>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-1 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Workspace preferences</h3>
              </div>

              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                These controls affect the presentation context of the dashboard.
              </p>
            </div>

            <Check className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex flex-col gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Operating region</p>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Select the railway network context shown across the workspace.
                </p>
              </div>

              <label>
                <span className="sr-only">Operating region</span>
                <select
                  value={network}
                  onChange={(event) => setNetwork(event.target.value)}
                  className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-[11px] font-semibold text-foreground outline-none"
                >
                  <option>Northline Region</option>
                  <option>East Junction</option>
                  <option>Coastal Corridor</option>
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Reporting period</p>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Controls the reporting window used by workspace views.
                </p>
              </div>

              <label>
                <span className="sr-only">Reporting period</span>
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-[11px] font-semibold text-foreground outline-none"
                >
                  <option>This month</option>
                  <option>Last 30 days</option>
                  <option>This quarter</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5">
              <div>
                <p className="text-xs font-semibold text-foreground">Demonstration data mode</p>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  The workspace uses simulated operational data.
                </p>
              </div>

              <span className="rounded-full bg-[hsl(var(--accent)/.12)] px-2 py-1 font-mono text-[9px] font-semibold text-[hsl(var(--accent))]">
                ACTIVE
              </span>
            </div>
          </div>
        </article>

        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
                Workspace status
              </p>
              <h3 className="mt-1.5 text-sm font-bold text-foreground">Current configuration</h3>
            </div>

            <ShieldCheck className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>

          <div className="mt-5 space-y-2">
            <div className="railzen-stat">
              <span>Active region</span>
              <strong>{network}</strong>
              <em>workspace context</em>
            </div>

            <div className="railzen-stat">
              <span>Reporting period</span>
              <strong>{period}</strong>
              <em>analytics window</em>
            </div>

            <div className="railzen-stat">
              <span>Data mode</span>
              <strong>Demo</strong>
              <em className="text-[hsl(var(--primary))]">frontend only</em>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              <p className="text-[10px] font-semibold text-foreground">
                Active operating area
              </p>
            </div>

            <p className="mt-2 text-xs font-semibold text-foreground">{network}</p>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              Settings are currently local to this demonstration workspace and do not update an external railway system.
            </p>
          </div>
        </article>
      </section>
    </RailzenShell>
  );
}

export default Settings;