import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";

const TABS = [
  { id: "code", label: "Solution.ts", icon: Code2 },
  { id: "question", label: "Prompt", icon: MessageSquare },
  { id: "feedback", label: "AI Feedback", icon: Sparkles },
];

const WAVE_HEIGHTS = Array.from({ length: 34 }, (_, index) =>
  Math.round(22 + Math.abs(Math.sin(index * 1.35)) * 78)
);

const CODE_LINES = [
  <>
    <span className="text-violet-600">function</span>{" "}
    <span className="text-sky-600">twoSum</span>
    <span className="text-slate-400">(</span>
    <span className="text-amber-600">nums</span>
    <span className="text-slate-400">: </span>
    <span className="text-emerald-600">number</span>
    <span className="text-slate-400">[], </span>
    <span className="text-amber-600">target</span>
    <span className="text-slate-400">: </span>
    <span className="text-emerald-600">number</span>
    <span className="text-slate-400">): </span>
    <span className="text-emerald-600">number</span>
    <span className="text-slate-400">[]</span> <span className="text-slate-400">{"{"}</span>
  </>,
  <>
    <span className="pl-4 text-slate-500">const</span>{" "}
    <span className="text-sky-600">seen</span> <span className="text-slate-400">=</span>{" "}
    <span className="text-violet-600">new</span>{" "}
    <span className="text-emerald-600">Map</span>
    <span className="text-slate-400">&lt;</span>
    <span className="text-emerald-600">number</span>
    <span className="text-slate-400">, </span>
    <span className="text-emerald-600">number</span>
    <span className="text-slate-400">&gt;();</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className="pl-4 text-slate-500">for</span>{" "}
    <span className="text-slate-400">(</span>
    <span className="text-violet-600">let</span> <span className="text-sky-600">i</span>{" "}
    <span className="text-slate-400">=</span> <span className="text-amber-600">0</span>
    <span className="text-slate-400">; </span>
    <span className="text-sky-600">i</span> <span className="text-slate-400">&lt;</span>{" "}
    <span className="text-sky-600">nums</span>
    <span className="text-slate-400">.length; </span>
    <span className="text-sky-600">i</span>
    <span className="text-slate-400">++) {"{"}</span>
  </>,
  <>
    <span className="pl-8 text-slate-500">const</span>{" "}
    <span className="text-sky-600">diff</span> <span className="text-slate-400">=</span>{" "}
    <span className="text-sky-600">target</span> <span className="text-slate-400">-</span>{" "}
    <span className="text-sky-600">nums</span>
    <span className="text-slate-400">[</span>
    <span className="text-sky-600">i</span>
    <span className="text-slate-400">];</span>
  </>,
  <>
    <span className="pl-8 text-slate-500">if</span>{" "}
    <span className="text-slate-400">(</span>
    <span className="text-sky-600">seen</span>
    <span className="text-slate-400">.has(</span>
    <span className="text-sky-600">diff</span>
    <span className="text-slate-400">)) </span>
    <span className="text-violet-600">return</span>{" "}
    <span className="text-slate-400">[</span>
    <span className="text-sky-600">seen</span>
    <span className="text-slate-400">.get(</span>
    <span className="text-sky-600">diff</span>
    <span className="text-slate-400">)!, </span>
    <span className="text-sky-600">i</span>
    <span className="text-slate-400">];</span>
  </>,
  <>
    <span className="pl-8 text-sky-600">seen</span>
    <span className="text-slate-400">.set(</span>
    <span className="text-sky-600">nums</span>
    <span className="text-slate-400">[</span>
    <span className="text-sky-600">i</span>
    <span className="text-slate-400">], </span>
    <span className="text-sky-600">i</span>
    <span className="text-slate-400">);</span>
  </>,
  <>
    <span className="pl-4 text-slate-500">{"}"}</span>
  </>,
  <>
    <span className="pl-4 text-slate-500">return</span>{" "}
    <span className="text-slate-400">[];</span>
  </>,
  <>
    <span className="text-slate-500">{"}"}</span>
  </>,
];

function WorkspacePreview() {
  const [activeTab, setActiveTab] = useState("code");

  return (
    <div className="relative mx-auto mt-14 max-w-6xl sm:mt-20">
      <div className="pointer-events-none absolute -inset-x-8 -top-12 h-64 rounded-full bg-indigo-500/10 blur-[110px]" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto hidden min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-[10px] text-slate-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="truncate font-mono">
              app.intelli-prep.dev/session/dsa-arrays
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live analysis
            </span>
            <span className="hidden h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[9px] font-bold text-white sm:flex">
              JD
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_228px]">
          {/* Editor / question / feedback */}
          <div className="min-w-0 border-slate-200 lg:border-r">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 sm:px-4">
              <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <span className="hidden shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-[9px] text-slate-500 sm:block">
                TypeScript
              </span>
            </div>

            <div className="min-h-[286px] px-4 py-4 sm:px-5">
              {activeTab === "code" && (
                <div className="font-mono text-[11px] leading-6 sm:text-xs">
                  {CODE_LINES.map((line, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="w-4 select-none text-right text-slate-300">
                        {index + 1}
                      </span>
                      <span className="whitespace-pre text-slate-700">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "question" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                      Generated for Senior Frontend Engineer · Stripe
                    </p>
                    <h3 className="mt-2 text-sm font-semibold leading-relaxed text-slate-900 sm:text-base">
                      Design a resilient, rate-limited API gateway for a
                      multi-tenant SaaS platform. Walk through your caching and
                      failure-mode strategy.
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["System Design", "45 min", "Senior level", "Trade-offs"].map(
                      (chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                        >
                          {chip}
                        </span>
                      )
                    )}
                  </div>
                  <ul className="space-y-2 border-t border-slate-200 pt-3 text-[11px] text-slate-600">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Cover tenant isolation and noisy-neighbour protection.
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Explain retries, backoff, and idempotency keys.
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Call out observability and SLO trade-offs.
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "feedback" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-indigo-600">
                        Overall signal
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        Strong senior-level response
                      </p>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">
                      87<span className="text-xs text-slate-500">/100</span>
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-[11px] leading-relaxed text-slate-600">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Clear trade-off reasoning around cache invalidation.
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Good structure: constraints → design → failure modes.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 h-3.5 w-3.5 shrink-0 text-center text-amber-600">
                        !
                      </span>
                      Reduce filler words — 2 detected in the last 30 seconds.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 h-3.5 w-3.5 shrink-0 text-center text-amber-600">
                        !
                      </span>
                      Add a concrete retry budget and dead-letter strategy.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Live HUD */}
          <aside className="space-y-3 border-t border-slate-200 bg-slate-50/60 p-4 lg:border-t-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Live metrics
              </span>
              <span className="font-mono text-[9px] text-slate-400">00:18:42</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Readiness</span>
                <span className="font-semibold text-slate-900">87%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-black to-white-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] text-slate-500">Pacing</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  142 <span className="text-[10px] font-normal text-slate-500">wpm</span>
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] text-slate-500">Code efficiency</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  92<span className="text-[10px] font-normal text-slate-500">/100</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Speech signal</span>
                <span className="flex items-center gap-1 text-[9px] text-emerald-600">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                  listening
                </span>
              </div>
              <div className="mt-3 flex h-10 items-center justify-between gap-[2px]">
                {WAVE_HEIGHTS.map((height, index) => (
                  <span
                    key={index}
                    className="w-[3px] animate-wave origin-center rounded-full bg-gradient-to-r from-green-600 to-blue-600"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${(index % 9) * 0.09}s`,
                      animationDuration: `${0.9 + (index % 5) * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/70 px-4 py-2.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Analysis engine online · 3 signals streaming
          </span>
          <span className="font-mono">Ctrl + Enter to submit</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ onGetStarted, onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-44 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-black-500/10 blur-[140px]" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-black-500/10 blur-[120px]" />
        <div className="absolute left-0 top-72 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm shadow-slate-900/5 backdrop-blur sm:text-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black shadow shadow-indigo-500/40">
              <BrainCircuit className="h-5 w-5 text-white" />
            </span>
            <span>Powered by Next-Gen AI &amp; MERN Architecture</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          </div>

          <h1 className="mt-7 text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-slate-900 sm:text-5xl md:text-6xl lg:text-[68px]">
            Master Your Technical Interviews with{" "}
            <span className="text-cyan-600">AI-Powered Precision</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-600 sm:text-lg">
            Simulate real-world coding, DSA, System Design, and behavioral
            assessments. Get instant, context-aware analysis and real-time
            performance tracking in an interactive sandbox workspace.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onGetStarted}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/40 hover:brightness-110 sm:w-auto"
            >
              Start Interactive Session
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("topics")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            >
              <PlayCircle className="h-4 w-4 text-black-600 transition-transform group-hover:scale-110" />
              Explore Sandbox Demo
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500 sm:text-xs">
            {["No credit card required", "Instant AI feedback", "Runs in your browser"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <WorkspacePreview />
      </div>
    </section>
  );
}
