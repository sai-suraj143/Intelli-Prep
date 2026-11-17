import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LandingLogo } from "./Brand";

export default function LandingNav({ items, onGetStarted }) {
  const [open, setOpen] = useState(false);

  const handleItem = (item) => {
    item.action();
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <LandingLogo
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleItem(item)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-white to-black px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:shadow-indigo-500/35 hover:brightness-110"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:text-slate-900 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-5 pb-6 pt-2 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItem(item)}
                className="border-b border-slate-100 py-3.5 text-left text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </button>
            ))}

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 shadow-sm"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
