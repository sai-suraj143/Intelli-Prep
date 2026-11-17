import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Mic,
  Terminal,
} from "lucide-react";

const WAVE_HEIGHTS = Array.from({ length: 26 }, (_, index) =>
  Math.round(18 + Math.abs(Math.sin(index * 1.6)) * 82)
);

const TREND = [
  { day: "M", value: 48 },
  { day: "T", value: 62 },
  { day: "W", value: 55 },
  { day: "T", value: 74 },
  { day: "F", value: 68 },
  { day: "S", value: 84 },
  { day: "S", value: 94 },
];

function BentoCard({
  className = "",
  icon,
  eyebrow,
  title,
  description,
  glow = "bg-indigo-500/20",
  children,
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 sm:p-7 ${className}`}
    >
      <div
        // className={`pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-15 blur-[90px] transition-opacity duration-500 group-hover:opacity-40 ${glow}`}
      />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 text-indigo-600 shadow-inner shadow-slate-900/5">
            {icon}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {eyebrow}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          {description}
        </p>

        <div className="mt-5 flex-1">{children}</div>
      </div>
    </article>
  );
}

function CodeVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="rounded-md bg-slate-900 px-2 py-1 font-mono text-white">
            solution.ts
          </span>
          <span className="px-1.5 py-1 font-mono text-slate-400">
            test.spec.ts
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
          <Check className="h-3 w-3" /> All tests passed · 6/6
        </span>
      </div>

      <div className="overflow-x-auto p-3 font-mono text-[10px] leading-5 sm:text-[11px]">
        <div className="flex gap-3">
          <span className="select-none text-slate-300">1</span>
          <span className="whitespace-pre text-slate-700">
            <span className="text-violet-600">const</span>{" "}
            <span className="text-sky-600">memo</span>{" "}
            <span className="text-slate-400">=</span>{" "}
            <span className="text-violet-600">new</span>{" "}
            <span className="text-emerald-600">Map</span>
            <span className="text-slate-400">&lt;</span>
            <span className="text-emerald-600">string</span>
            <span className="text-slate-400">, </span>
            <span className="text-emerald-600">number</span>
            <span className="text-slate-400">&gt;();</span>
          </span>
        </div>
        <div className="flex gap-3">
          <span className="select-none text-slate-300">2</span>
          <span className="whitespace-pre text-slate-700">
            <span className="text-violet-600">export function</span>{" "}
            <span className="text-sky-600">solve</span>
            <span className="text-slate-400">(</span>
            <span className="text-amber-600">grid</span>
            <span className="text-slate-400">: </span>
            <span className="text-emerald-600">number</span>
            <span className="text-slate-400">[][]</span>
            <span className="text-slate-400">) {"{"}</span>
          </span>
        </div>
        <div className="flex gap-3">
          <span className="select-none text-slate-300">3</span>
          <span className="whitespace-pre pl-4 text-slate-700">
            <span className="text-violet-600">if</span>{" "}
            <span className="text-slate-400">(!</span>
            <span className="text-sky-600">grid</span>
            <span className="text-slate-400">.length) </span>
            <span className="text-violet-600">return</span>{" "}
            <span className="text-amber-600">0</span>
            <span className="text-slate-400">;</span>
          </span>
        </div>
        <div className="flex gap-3">
          <span className="select-none text-slate-300">4</span>
          <span className="whitespace-pre pl-4 text-slate-700">
            <span className="text-violet-600">const</span>{" "}
            <span className="text-sky-600">best</span>{" "}
            <span className="text-slate-400">=</span>{" "}
            <span className="text-sky-600">memo</span>
            <span className="text-slate-400">.get(</span>
            <span className="text-emerald-600">key</span>
            <span className="text-slate-400">);</span>
          </span>
        </div>
        <div className="flex gap-3">
          <span className="select-none text-slate-300">5</span>
          <span className="whitespace-pre pl-4 text-slate-700">
            <span className="text-violet-600">return</span>{" "}
            <span className="text-sky-600">best</span>{" "}
            <span className="text-slate-400">??</span>{" "}
            <span className="text-sky-600">compute</span>
            <span className="text-slate-400">(</span>
            <span className="text-sky-600">grid</span>
            <span className="text-slate-400">);</span>
          </span>
        </div>
        <div className="flex gap-3">
          <span className="select-none text-slate-300">6</span>
          <span className="whitespace-pre text-slate-500">{"}"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-3 py-2 text-[9px]">
        <span className="font-semibold text-emerald-600">
          ✓ 6 tests passed · 0 warnings
        </span>
        <span className="font-mono text-slate-500">24ms · O(n) · 98% faster</span>
      </div>
    </div>
  );
}

function SpeechVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
          <Mic className="h-3.5 w-3.5 text-indigo-600" />
          Live transcription
        </span>
        <span className="flex items-center gap-1 text-[9px] text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          recording
        </span>
      </div>

      <p className="mt-3 border-l-2 border-indigo-300 pl-2.5 text-[11px] leading-relaxed text-slate-700">
        “I’d isolate tenant traffic at the gateway layer, then apply per-tenant
        token buckets so a single noisy client can’t starve the others…”
      </p>

      <div className="mt-4 flex h-12 items-center justify-between gap-[3px]">
        {WAVE_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="w-full origin-center animate-wave rounded-full bg-gradient-to-t from-green-500 to-blue-500"
            style={{
              height: `${height}%`,
              animationDelay: `${(index % 7) * 0.1}s`,
              animationDuration: `${0.9 + (index % 4) * 0.14}s`,
            }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 text-center">
        {[
          { label: "Confidence", value: "94%" },
          { label: "Pace", value: "148" },
          { label: "Fillers", value: "2" },
        ].map((metric) => (
          <div key={metric.label}>
            <p className="text-xs font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-0.5 text-[9px] text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
          <Terminal className="h-3 w-3 text-indigo-600" />
          POST /api/questions/generate
        </span>
        <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] text-emerald-700">
          200 OK
        </span>
      </div>

      <pre className="overflow-x-auto p-3 font-mono text-[10px] leading-5 text-slate-500">
        <code>
          <span className="text-slate-400">{"{"}</span>
          {"\n  "}
          <span className="text-sky-600">"role"</span>
          <span className="text-slate-400">: </span>
          <span className="text-amber-600">"Senior Frontend"</span>
          <span className="text-slate-400">,</span>
          {"\n  "}
          <span className="text-sky-600">"company"</span>
          <span className="text-slate-400">: </span>
          <span className="text-amber-600">"Stripe"</span>
          <span className="text-slate-400">,</span>
          {"\n  "}
          <span className="text-sky-600">"focus"</span>
          <span className="text-slate-400">: [</span>
          <span className="text-amber-600">"React"</span>
          <span className="text-slate-400">, </span>
          <span className="text-amber-600">"System Design"</span>
          <span className="text-slate-400">],</span>
          {"\n  "}
          <span className="text-sky-600">"difficulty"</span>
          <span className="text-slate-400">: </span>
          <span className="text-amber-600">"senior"</span>
          {"\n"}
          <span className="text-slate-400">{"}"}</span>
        </code>
      </pre>

      <div className="border-t border-slate-200 bg-indigo-50/70 px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-600">
          <Bot className="h-3 w-3" /> Generated prompt
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700">
          Design a rate-limited API gateway with tenant isolation and graceful
          degradation…
        </p>
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-500">
            Skill radar
          </span>
          <span className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[9px] text-indigo-600">
            Top 8%
          </span>
        </div>
        <svg
          viewBox="0 0 200 185"
          className="mt-1 h-40 w-full"
          role="img"
          aria-label="Radar chart showing strong DSA, communication, and confidence scores"
        >
          <g stroke="rgba(15,23,42,0.10)" fill="none">
            <polygon points="100,30 166.6,78.4 141.1,156.6 58.9,156.6 33.4,78.4" />
            <polygon points="100,65 133.3,89.2 120.6,128.3 79.4,128.3 66.7,89.2" />
            <line x1="100" y1="100" x2="100" y2="30" />
            <line x1="100" y1="100" x2="166.6" y2="78.4" />
            <line x1="100" y1="100" x2="141.1" y2="156.6" />
            <line x1="100" y1="100" x2="58.9" y2="156.6" />
            <line x1="100" y1="100" x2="33.4" y2="78.4" />
          </g>
          <polygon
            points="100,37 151.9,83.1 135,148.1 71.2,139.6 41.4,81"
            fill="rgba(99,102,241,0.16)"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          {[
            [100, 37],
            [151.9, 83.1],
            [135, 148.1],
            [71.2, 139.6],
            [41.4, 81],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="#6366f1" />
          ))}
          <g fill="#64748b" fontSize="7" fontWeight="600">
            <text x="100" y="20" textAnchor="middle">DSA</text>
            <text x="176" y="76" textAnchor="start">System</text>
            <text x="148" y="172" textAnchor="middle">Comms</text>
            <text x="52" y="172" textAnchor="middle">Confidence</text>
            <text x="24" y="76" textAnchor="end">Quality</text>
          </g>
        </svg>
      </div>

      <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-500">
            Readiness trend
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
            <ArrowUpRight className="h-3 w-3" /> 18%
          </span>
        </div>

        <div className="mt-3 flex flex-1 items-end justify-between gap-2">
          {TREND.map((item, index) => (
            <div
              key={`${item.day}-${index}`}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <div className="flex h-24 w-full items-end rounded-sm bg-slate-100">
                <div
                  className="w-full rounded-sm bg-black transition-all duration-500"
                  style={{ height: `${item.value}%` }}
                />
              </div>
              <span className="text-[8px] text-slate-400">{item.day}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2.5">
          <span className="text-[9px] text-slate-500">Confidence score</span>
          <span className="text-sm font-bold text-slate-900">
            94<span className="text-[9px] font-normal text-slate-500">/100</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FeatureBento({ onNavigate }) {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <span id="solutions" className="block scroll-mt-24" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Platform capabilities
            </p>
            <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl">
              One workspace.{" "}
              <span className="text-gradient">Every interview signal.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              From the first keystroke to the final sentence, Intelli-Prep
              captures how you think, speak, and ship — then turns it into
              feedback you can act on.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("topics")}
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Open sandbox
            <ChevronRight className="h-4 w-4 text-indigo-600 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 lg:grid-cols-3">
          <BentoCard
            className="lg:col-span-2"
            icon={<Terminal className="h-5 w-5" />}
            eyebrow="Live coding sandbox"
            title="Live Coding & DSA Sandbox"
            description="Solve algorithm challenges in a real editor with instant test runs, complexity hints, and evaluation badges that mirror a live interview loop."
            glow="bg-indigo-500/25"
          >
            <CodeVisual />
          </BentoCard>

          <BentoCard
            icon={<Mic className="h-5 w-5" />}
            eyebrow="Speech intelligence"
            title="Speech & Audio Intelligence"
            description="Real-time voice-to-text, filler-word detection, tone analysis, and pacing metrics for every answer you give."
            glow="bg-fuchsia-500/20"
          >
            <SpeechVisual />
          </BentoCard>

          <BentoCard
            icon={<Bot className="h-5 w-5" />}
            eyebrow="Adaptive prompts"
            title="Context-Aware Question Engine"
            description="A role-aware engine generates questions from your target company, stack, and seniority — no generic question banks."
            glow="bg-sky-500/20"
          >
            <QuestionVisual />
          </BentoCard>

          <BentoCard
            className="lg:col-span-2"
            icon={<BarChart3 className="h-5 w-5" />}
            eyebrow="Analytics engine"
            title="Performance & Analytics Engine"
            description="Redux-backed session state feeds live readiness scores, skill radars, confidence trends, and historical performance — all in one view."
            glow="bg-violet-500/25"
          >
            <AnalyticsVisual />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
