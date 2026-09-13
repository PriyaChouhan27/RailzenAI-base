import { Activity, ArrowUpRight, Bot, BrainCircuit, Building2, ChevronRight } from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const insightData = [
  {
    title: 'East Junction remains stable',
    detail:
      'Bridge 07 health is holding at 82% with no emerging network-wide impact detected.',
    tag: 'Network insight',
    icon: Building2,
  },
  {
    title: 'Signal 14B needs review',
    detail:
      'Inspection is due now and the current condition score suggests prioritizing the next access window.',
    tag: 'Maintenance insight',
    icon: BrainCircuit,
  },
  {
    title: 'Northline access window is favorable',
    detail:
      'The current operating schedule leaves a suitable window for maintenance planning with limited passenger impact.',
    tag: 'Planning insight',
    icon: Activity,
  },
];

function AiAssistant() {
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Decision support
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            AI operations assistant
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Prioritized operational insights from the current demonstration workspace.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          DEMO MODE
        </span>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Operational insights</h3>
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Review machine-assisted signals before making a planning decision.
              </p>
            </div>

            <span className="rounded bg-[hsl(var(--primary)/.1)] px-1.5 py-0.5 font-mono text-[9px] text-[hsl(var(--primary))]">
              03 SIGNALS
            </span>
          </div>

          <div className="mt-5 space-y-2">
            {insightData.map((insight) => {
              const Icon = insight.icon;

              return (
                <button
                  key={insight.title}
                  type="button"
                  className="group w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5 text-left hover:bg-[hsl(var(--secondary)/.6)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[hsl(var(--primary)/.1)] p-2">
                      <Icon className="h-4 w-4 text-[hsl(var(--primary))]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {insight.title}
                        </span>
                        <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                          {insight.tag}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">
                        {insight.detail}
                      </p>
                    </div>

                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </article>

        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
                Assistant workspace
              </p>
              <h3 className="mt-1.5 text-sm font-bold text-foreground">Planning context</h3>
            </div>
            <Bot className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>

          <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--primary))]">
              Current focus
            </p>
            <p className="mt-2 text-xs font-semibold text-foreground">
              Signal 14B inspection
            </p>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              Condition is below the preferred review threshold and should be considered before
              the next Northline access window.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="railzen-stat">
              <span>High-risk assets</span>
              <strong>01</strong>
              <em className="text-[hsl(var(--destructive))]">review</em>
            </div>

            <div className="railzen-stat">
              <span>Planning opportunities</span>
              <strong>02</strong>
              <em className="text-[hsl(var(--primary))]">available</em>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground"
          >
            Review planning context <ArrowUpRight className="h-3 w-3" />
          </button>

          <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
            This assistant uses demonstration insights only. No external AI action is triggered
            from this page.
          </p>
        </article>
      </section>
    </RailzenShell>
  );
}

export default AiAssistant;
