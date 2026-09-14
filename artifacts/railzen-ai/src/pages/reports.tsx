import { useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const reports = [
  {
    title: 'Maintenance performance',
    detail: 'Work completion, efficiency, and backlog performance across the operating area.',
    value: '82%',
    meta: 'Completion',
  },
  {
    title: 'Asset condition',
    detail: 'Infrastructure health and inspection coverage for monitored assets.',
    value: '91%',
    meta: 'Coverage',
  },
  {
    title: 'Network operations',
    detail: 'Route availability and service-level performance for the current period.',
    value: '98.2%',
    meta: 'Availability',
  },
  {
    title: 'Alert activity',
    detail: 'Operational events surfaced for planner and control-room review.',
    value: '03',
    meta: 'Active',
  },
];

const reportViews = [
  'Daily operating summary',
  'Maintenance backlog',
  'Asset inspection register',
  'Network availability report',
];

function Reports() {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Reporting workspace
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Operational reports
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Review standard reporting views for maintenance and network operations.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          THIS MONTH
        </span>
      </div>

      <section className="railzen-reveal railzen-reveal-delay-1 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <article key={report.title} className="railzen-panel railzen-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
                {report.title}
              </p>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <p className="mt-4 font-display text-2xl font-bold tracking-[-.04em] text-foreground">
              {report.value}
            </p>

            <p className="mt-1 text-[10px] font-medium text-[hsl(var(--primary))]">
              {report.meta}
            </p>

            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
              {report.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)]">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Available reports</h3>
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Standard report views available to the operating workspace
              </p>
            </div>

            <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-1 font-mono text-[9px] text-muted-foreground">
              04 VIEWS
            </span>
          </div>

          <div className="mt-5 space-y-2">
            {reportViews.map((report, index) => (
              <button
                key={report}
                type="button"
                onClick={() => setSelectedReport(report)}
                className="group flex w-full items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5 text-left hover:bg-[hsl(var(--secondary)/.6)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-mono text-[9px] text-muted-foreground">
                    0{index + 1}
                  </span>
                  <span className="truncate text-xs font-semibold text-foreground">
                    {report}
                  </span>
                </div>

                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </article>

        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
            Reporting context
          </p>

          <h3 className="mt-1.5 text-sm font-bold text-foreground">
            Current workspace period
          </h3>

          <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--primary))]">
              Reporting window
            </p>

            <p className="mt-2 font-display text-2xl font-bold tracking-[-.04em] text-foreground">
              This month
            </p>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              The displayed metrics represent the current demonstration workspace period.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="railzen-stat">
              <span>Reports available</span>
              <strong>04</strong>
              <em>workspace views</em>
            </div>

            <div className="railzen-stat">
              <span>Data mode</span>
              <strong>Demo</strong>
              <em>not live feed</em>
            </div>
          </div>

          <p className="mt-4 text-[10px] leading-4 text-muted-foreground">
            Report cards currently represent frontend views. No report-generation backend action is triggered here.
          </p>
        </article>
      </section>

            {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--background)/.72)] p-4 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="railzen-panel w-full max-w-md p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--primary))]">
              Report view
            </p>

            <h3 className="mt-2 text-sm font-bold text-foreground">
              {selectedReport}
            </h3>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              This demonstration report view is ready for review. In a live
              system, this action would load the selected report and its
              supporting operational data.
            </p>

            <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
              <p className="font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">
                Status
              </p>

              <p className="mt-1 text-xs font-semibold text-[hsl(var(--primary))]">
                Available for review
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-md border border-[hsl(var(--border))] px-3 py-2 text-[10px] font-semibold text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
  window.location.href = `/reports/${encodeURIComponent(selectedReport)}`;
}}
                className="rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-[10px] font-semibold text-[hsl(var(--primary-foreground))]"
              >
                Open report
              </button>
            </div>
          </div>
        </div>
      )}

    </RailzenShell>
  );
}

export default Reports;