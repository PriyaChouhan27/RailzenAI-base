import { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Gauge,
  MapPinned,
  Route as RouteIcon,
} from 'lucide-react';
import { RailzenShell } from '@/components/railzen-shell';

const networkSegments = [
  {
    name: 'Northline Main',
    section: 'km 12.0 — km 48.5',
    availability: '99.1%',
    trains: '24',
    status: 'Operational',
  },
  {
    name: 'East Junction',
    section: 'km 0.0 — km 31.2',
    availability: '97.8%',
    trains: '11',
    status: 'Watch',
  },
  {
    name: 'Coastal Corridor',
    section: 'km 64.0 — km 91.7',
    availability: '98.6%',
    trains: '07',
    status: 'Operational',
  },
];

function Network() {
      const [selectedSegment, setSelectedSegment] = useState('Northline Main');
  return (
    <RailzenShell>
      <div className="railzen-reveal mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--primary))]">
              Network operations
            </p>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-[-.045em] text-foreground sm:text-3xl">
            Network status
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Monitor route availability, service activity, and operating conditions.
          </p>
        </div>

        <span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          LIVE WORKSPACE VIEW
        </span>
      </div>

      <section className="railzen-reveal railzen-reveal-delay-1 grid grid-cols-2 gap-3 md:grid-cols-4">
        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Route availability
            </p>
            <RouteIcon className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">98.2%</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">+0.6% today</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Trains monitored
            </p>
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">42</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--primary))]">03 added today</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Average speed
            </p>
            <Gauge className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">71 km/h</p>
          <p className="mt-1 text-[10px] text-muted-foreground">network average</p>
        </article>

        <article className="railzen-panel railzen-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
              Open work zones
            </p>
            <MapPinned className="h-3.5 w-3.5 text-[hsl(var(--destructive))]" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">05</p>
          <p className="mt-1 text-[10px] text-[hsl(var(--accent))]">02 tonight</p>
        </article>
      </section>

      <section className="mt-5">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-2 overflow-hidden p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-foreground">Operating segments</h3>
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                Current availability and service activity across monitored corridors
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-foreground"
            >
              Open network map <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {networkSegments.map((segment) => (
              <article
                key={segment.name}
                className="grid gap-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-3.5 md:grid-cols-[minmax(220px,1.3fr)_140px_120px_140px_auto] md:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        segment.status === 'Operational'
                          ? 'bg-[hsl(var(--primary))]'
                          : 'bg-[hsl(var(--accent))]'
                      }`}
                    />
                    <p className="text-xs font-semibold text-foreground">{segment.name}</p>
                  </div>
                  <p className="mt-1 pl-4 text-[10px] text-muted-foreground">{segment.section}</p>
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">
                    Availability
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    {segment.availability}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">
                    Trains
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">{segment.trains}</p>
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">
                    Condition
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                      segment.status === 'Operational'
                        ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                        : 'bg-[hsl(var(--accent)/.12)] text-[hsl(var(--accent))]'
                    }`}
                  >
                    {segment.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 justify-self-start text-[10px] font-semibold text-muted-foreground hover:text-foreground md:justify-self-end"
                >
                  View details <ChevronRightIcon />
                </button>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
            Service pulse
          </p>
          <h3 className="mt-1.5 text-sm font-bold text-foreground">Network availability</h3>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Current network</span>
              <span className="font-mono text-xs font-semibold text-[hsl(var(--primary))]">
                98.2%
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--secondary))]">
              <div className="h-full w-[98.2%] rounded-full bg-[hsl(var(--primary))]" />
            </div>

            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
              No access restrictions affecting passenger routes in the current demonstration
              window.
            </p>
          </div>
        </article>

        <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
            Operational note
          </p>
          <h3 className="mt-1.5 text-sm font-bold text-foreground">Planning context</h3>

          <div className="mt-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[.13em] text-[hsl(var(--accent))]">
              Watch item
            </p>
            <p className="mt-1 text-xs font-semibold text-foreground">
              East Junction is operating below the network average.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
              Keep current maintenance windows visible to planners while the route remains under
              normal service monitoring.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-5">
  <article className="railzen-panel railzen-reveal railzen-reveal-delay-3 overflow-hidden p-4 sm:p-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
      <div>
        <div className="flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-bold text-foreground">Network map</h3>
        </div>

        <p className="mt-1 pl-6 text-xs text-muted-foreground">
          Schematic operating view of monitored railway corridors and current status
        </p>
      </div>

      <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
          Operational
        </span>

        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          Watch
        </span>
      </div>
    </div>

    <div className="relative mt-5 min-h-[340px] overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.25)]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(hsl(var(--border)/.35)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/.35)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative flex min-h-[340px] items-center justify-center p-6 sm:p-10">
        <svg
          viewBox="0 0 960 330"
          className="h-full w-full max-w-[1050px]"
          fill="none"
          role="img"
          aria-label="Railway network schematic"
        >
          <defs>
            <filter id="network-glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M90 250 C210 210 260 105 405 88 C540 72 585 140 695 116 C785 96 815 55 900 68"
            stroke={
  selectedSegment === 'Northline Main'
    ? 'hsl(var(--primary))'
    : 'hsl(var(--muted-foreground))'
}
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path
            d="M90 250 C210 210 260 105 405 88 C540 72 585 140 695 116 C785 96 815 55 900 68"
            stroke={
  selectedSegment === 'Northline Main'
    ? 'hsl(var(--primary))'
    : 'hsl(var(--muted-foreground)/.35)'
}
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M405 88 C435 145 495 215 585 254 C655 285 730 275 810 238"
           stroke={
  selectedSegment === 'East Junction'
    ? 'hsl(var(--accent))'
    : 'hsl(var(--muted-foreground)/.35)'
}
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path
            d="M405 88 C435 145 495 215 585 254 C655 285 730 275 810 238"
            stroke={
  selectedSegment === 'East Junction'
    ? 'hsl(var(--accent))'
    : 'hsl(var(--muted-foreground)/.35)'
}
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M585 254 C655 216 720 183 790 188 C835 192 855 216 900 235"
            stroke={
  selectedSegment === 'Coastal Corridor'
    ? 'hsl(var(--primary))'
    : 'hsl(var(--muted-foreground)/.35)'
}
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path
            d="M585 254 C655 216 720 183 790 188 C835 192 855 216 900 235"
            stroke={
  selectedSegment === 'Coastal Corridor'
    ? 'hsl(var(--primary))'
    : 'hsl(var(--muted-foreground)/.35)'
}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {[
  { x: 90, y: 250, label: 'Northline', segment: 'Northline Main' },
  { x: 405, y: 88, label: 'Central', segment: 'Northline Main' },
  { x: 585, y: 254, label: 'East Junction', segment: 'East Junction' },
  { x: 810, y: 238, label: 'Coastal', segment: 'Coastal Corridor' },
  { x: 900, y: 68, label: 'Terminal', segment: 'Coastal Corridor' },
].map((node) => {
  const selected = selectedSegment === node.segment;

  return (
    <g
      key={node.label}
      role="button"
      tabIndex={0}
      aria-label={`Select ${node.segment}`}
      className="cursor-pointer"
      onClick={() => setSelectedSegment(node.segment)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setSelectedSegment(node.segment);
        }
      }}
    >
      <circle
        cx={node.x}
        cy={node.y}
        r="12"
        fill="hsl(var(--background))"
        stroke={
          selected
            ? 'hsl(var(--primary))'
            : 'hsl(var(--muted-foreground))'
        }
        strokeWidth="3"
        filter="url(#network-glow)"
      />

      <circle
        cx={node.x}
        cy={node.y}
        r="4"
        fill={
          selected
            ? 'hsl(var(--primary))'
            : 'hsl(var(--muted-foreground))'
        }
      />

      <text
        x={node.x}
        y={node.y - 22}
        textAnchor="middle"
        fill={
          selected
            ? 'hsl(var(--primary))'
            : 'hsl(var(--foreground))'
        }
        fontSize="12"
        fontWeight="600"
      >
        {node.label}
      </text>
    </g>
  );
})}

          <g transform="translate(120 175)">
            <rect
              width="150"
              height="55"
              rx="10"
              fill="hsl(var(--popover))"
              stroke="hsl(var(--border))"
            />
            <text x="14" y="21" fill="hsl(var(--muted-foreground))" fontSize="9">
              NORTHLINE MAIN
            </text>
            <text x="14" y="40" fill="hsl(var(--foreground))" fontSize="13" fontWeight="700">
              99.1% available
            </text>
          </g>

          <g transform="translate(450 150)">
            <rect
              width="150"
              height="55"
              rx="10"
              fill="hsl(var(--popover))"
              stroke="hsl(var(--border))"
            />
            <text x="14" y="21" fill="hsl(var(--muted-foreground))" fontSize="9">
              EAST JUNCTION
            </text>
            <text x="14" y="40" fill="hsl(var(--foreground))" fontSize="13" fontWeight="700">
              97.8% available
            </text>
          </g>

          <g transform="translate(710 105)">
            <rect
              width="150"
              height="55"
              rx="10"
              fill="hsl(var(--popover))"
              stroke="hsl(var(--border))"
            />
            <text x="14" y="21" fill="hsl(var(--muted-foreground))" fontSize="9">
              COASTAL
            </text>
            <text x="14" y="40" fill="hsl(var(--foreground))" fontSize="13" fontWeight="700">
              98.6% available
            </text>
          </g>
        </svg>
      </div>

      <div className="absolute bottom-3 left-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--popover)/.88)] px-3 py-2 backdrop-blur">
        <p className="font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">
          Schematic view
        </p>
        <p className="mt-1 text-[10px] text-foreground">
          Demonstration network geometry
        </p>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--popover)/.88)] px-2.5 py-2 backdrop-blur">
        <Activity className="h-3 w-3 text-[hsl(var(--primary))]" />
        <span className="font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">
          Monitoring
        </span>
      </div>
    </div>
  </article>
</section>

    </RailzenShell>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4.5 2.25 3.25 3.75-3.25 3.75"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Network;