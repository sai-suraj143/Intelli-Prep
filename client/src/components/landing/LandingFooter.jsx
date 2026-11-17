import { Github, Linkedin, Mail } from "lucide-react";
import { LandingLogo } from "./Brand";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { label: "Email", href: "mailto:hello@intelli-prep.dev", icon: Mail },
];

const TECH = [
  { name: "MongoDB", dot: "bg-emerald-400" },
  { name: "Express", dot: "bg-slate-300" },
  { name: "React", dot: "bg-cyan-400" },
  { name: "Node.js", dot: "bg-green-400" },
  { name: "Redux", dot: "bg-violet-400" },
  { name: "Python AI", dot: "bg-amber-400" },
];

function FooterLink({ item }) {
  if (item.action) {
    return (
      <button
        type="button"
        onClick={item.action}
        className="text-left text-xs text-slate-500 transition-colors hover:text-slate-900"
      >
        {item.label}
      </button>
    );
  }

  return (
    <a
      href={item.href}
      className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-900"
    >
      {item.status && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      )}
      {item.label}
    </a>
  );
}

export default function LandingFooter({ onGetStarted, onNavigate, onScrollTop }) {
  const columns = [
    {
      title: "Product",
      items: [
        { label: "Features", href: "#features" },
        { label: "Sandbox Workspace", action: () => onNavigate?.("topics") },
        { label: "Mock Sessions", action: onGetStarted },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Interview Playbook", href: "#features" },
        { label: "AI Scoring Guide", href: "#solutions" },
        { label: "Architecture Notes", href: "#features" },
        { label: "Support", href: "mailto:support@intelli-prep.dev" },
        { label: "Changelog", href: "#pricing" },
      ],
    },
  ];

  const legalItems = [
    { label: "Privacy Policy", href: "#pricing" },
    { label: "Terms of Service", href: "#pricing" },
    { label: "Security", href: "#features" },
    { label: "Status", href: "#pricing", status: true },
  ];

  return (
    <footer id="footer" className="relative border-t border-slate-200 bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <LandingLogo onClick={onScrollTop} />
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-slate-500">
              AI-powered interview preparation for engineers who want evidence,
              not guesswork. Simulate the real loop, then fix what actually
              matters.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              All systems operational
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold text-slate-900">{column.title}</h4>
              <ul className="mt-4 space-y-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold text-slate-900">
              Tech Stack &amp; Architecture
            </h4>
            <ul className="mt-4 space-y-2.5">
              {TECH.map((tech) => (
                <li key={tech.name} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${tech.dot}`} />
                  <span className="text-xs text-slate-500">{tech.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] leading-relaxed text-slate-400">
              Typed MERN client · Express API · Python speech + scoring bridge
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900">Legal</h4>
            <ul className="mt-4 space-y-3">
              {legalItems.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-[11px] text-slate-400 sm:flex-row sm:items-center">
          <p>© 2026 Intelli-Prep Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Built with the MERN stack</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Designed for engineers, by engineers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
