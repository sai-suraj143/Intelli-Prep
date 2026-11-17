import { ShieldCheck } from "lucide-react";

const STACK = [
  { name: "MongoDB", dot: "bg-emerald-400", note: "user + session data" },
  { name: "Express", dot: "bg-slate-300", note: "API layer" },
  { name: "React", dot: "bg-cyan-400", note: "interface" },
  { name: "Node.js", dot: "bg-green-400", note: "runtime" },
  { name: "Redux", dot: "bg-violet-400", note: "state engine" },
];

export default function TechStackBar() {
  return (
    <section className="relative border-y border-slate-200 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:justify-between lg:gap-8">
        <p className="text-center text-xs font-medium text-slate-500 lg:text-left">
          Engineered for speed &amp; reliability using
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          {STACK.map((item) => (
            <div
              key={item.name}
              className="group flex items-center gap-2"
              title={item.note}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${item.dot} shadow-[0_0_8px_currentColor]`}
              />
              <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-900">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-2 text-[11px] font-medium text-slate-500 xl:flex">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Secure by design · typed end-to-end
        </div>
      </div>
    </section>
  );
}
