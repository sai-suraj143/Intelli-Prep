import LandingNav from "./landing/LandingNav";
import HeroSection from "./landing/HeroSection";
import TechStackBar from "./landing/TechStackBar";
import FeatureBento from "./landing/FeatureBento";
import FinalCTA from "./landing/FinalCTA";
import LandingFooter from "./landing/LandingFooter";

export default function LandingPage({ onGetStarted, onNavigate }) {
  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { label: "Features", action: () => scrollToId("features") },
    { label: "Sandbox Workspace", action: () => onNavigate?.("topics") },
    { label: "Solutions", action: () => scrollToId("solutions") },
    { label: "Pricing", action: () => scrollToId("pricing") },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F7F8FC] font-sans text-slate-600 selection:bg-indigo-500/20 selection:text-slate-900">
      <LandingNav items={navItems} onGetStarted={onGetStarted} />

      <main>
        <HeroSection onGetStarted={onGetStarted} onNavigate={onNavigate} />
        <TechStackBar />
        <FeatureBento onNavigate={onNavigate} />
        <FinalCTA onGetStarted={onGetStarted} />
      </main>

      <LandingFooter
        onGetStarted={onGetStarted}
        onNavigate={onNavigate}
        onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
}
