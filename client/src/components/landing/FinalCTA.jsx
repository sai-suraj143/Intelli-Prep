import { ArrowRight, Check, Sparkles } from "lucide-react";

const PROOF = [
  { value: "12,400+", label: "mock sessions run" },
  { value: "94%", label: "would recommend" },
  { value: "4.9/5", label: "average session rating" },
];

export default function FinalCTA({ onGetStarted }) {
  return (
    <section id="pricing" className="relative scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 p-px shadow-2xl shadow-indigo-500/25">
          <div className="relative overflow-hidden rounded-[27px] bg-cyan-900 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-grid-inverse [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
              <div className="absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-white/15 blur-[110px]" />
              <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-fuchsia-400/25 blur-[110px]" />
              <div className="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-blue-400/20 blur-[100px]" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium text-indigo-50 backdrop-blur">
                {/* <Sparkles className="h-3.5 w-3.5 text-indigo-100" /> */}
                Free while in beta · no credit card required
              </div>

              <h2 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
                Your next offer starts with{" "}
                <span className="bg-gradient-to-r from-white via-indigo-100 to-fuchsia-200 bg-clip-text text-transparent">
                  one mock session.
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-indigo-100/85 sm:text-base">
                Walk into your next interview with evidence, not guesswork.
                Run a full AI-scored session in minutes and get a clear plan for
                what to fix next.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-xl shadow-indigo-950/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-2xl sm:w-auto"
                >
                  Start Your First Mock Session
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/20 sm:w-auto"
                >
                  See how scoring works
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-indigo-100/80">
                {["Unlimited practice sessions", "Cancel anytime", "Your data stays yours"].map(
                  (item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      {item}
                    </span>
                  )
                )}
              </div>

              <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/15 pt-7">
                {PROOF.map((item) => (
                  <div key={item.label}>
                    <p className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] text-indigo-100/75 sm:text-[11px]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
