import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { RailzenShell } from '@/components/railzen-shell';

function ReportDetail() {
  const [, params] = useRoute('/reports/:id');

  const reportId = params?.id ?? 'report';

  return (
    <RailzenShell>
      <div className="railzen-reveal mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--primary))]">
            Report detail
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.04em] text-foreground">
            {reportId}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Detailed operational report view
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
  type="button"
  onClick={() => {
    const reportContent = [
      `Report: ${reportId}`,
      '',
      'Status: Ready',
      'Data mode: Demo',
      '',
      'Operational summary:',
      'This report detail view is available for the RailZen demonstration workspace.',
    ].join('\n');

    const blob = new Blob([reportContent], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${reportId.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }}
  className="inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border))] px-3 py-2 text-[10px] font-semibold text-muted-foreground hover:bg-[hsl(var(--secondary))] hover:text-foreground"
>
  <Download className="h-3.5 w-3.5" />
  Export
</button>

          <Link href="/reports">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-[10px] font-semibold text-[hsl(var(--primary-foreground))]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to reports
            </button>
          </Link>
        </div>
      </div>

      <section className="railzen-panel railzen-reveal railzen-reveal-delay-1 p-5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-bold text-foreground">Report summary</h3>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="railzen-stat">
            <span>Report ID</span>
            <strong>{reportId}</strong>
          </div>

          <div className="railzen-stat">
            <span>Status</span>
            <strong>Ready</strong>
          </div>

          <div className="railzen-stat">
            <span>Data mode</span>
            <strong>Demo</strong>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
          <p className="font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">
            Operational summary
          </p>

          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            This report detail view is available for the RailZen demonstration
            workspace. A production deployment can populate this section with
            live maintenance, network, asset, and alert data.
          </p>
        </div>
      </section>
    </RailzenShell>
  );
}

export default ReportDetail;