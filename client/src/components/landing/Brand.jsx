import { BrainCircuitIcon, Sparkles } from "lucide-react";

export function LandingLogo({ onClick, showTagline = true }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-2.5 text-left"
      aria-label="Intelli-Prep home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-black shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
        <BrainCircuitIcon className="h-5 w-5 text-white" />
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-tight text-slate-900">
          Intelli-Prep
        </span>
        {showTagline && (
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            AI Interview OS
          </span>
        )}
      </span>
    </button>
  );
}
