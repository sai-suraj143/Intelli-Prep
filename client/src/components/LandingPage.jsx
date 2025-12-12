import React from "react";
import { ChevronRight, Code, BarChart2, Mic, Terminal } from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center text-white">
      {/* --- Animated Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* --- Navbar --- */}
      <nav className="absolute top-0 w-full p-6 z-20 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Terminal className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tighter">
            Intelli<span className="text-blue-500">Prep</span>
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          Sign In
        </button>
      </nav>

      {/* --- Hero Content --- */}
      <div className="z-10 text-center max-w-4xl px-6 space-y-8">
        <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-1.5 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-300">
            AI-Powered Interview Coach v3.0
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Technical Interview
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Practice Data Structures, System Design, and Behavioral questions with
          an AI that listens, analyzes, and gives real-time feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105 flex items-center"
          >
            Start Practicing Now <ChevronRight className="ml-2 w-5 h-5" />
          </button>
          <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-lg border border-slate-800 transition-all">
            View Demo
          </button>
        </div>

        {/* --- Feature Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <Code className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Live Coding Prep</h3>
            <p className="text-slate-500 text-sm">
              Practice DSA questions with voice-to-code analysis.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <Mic className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Speech Analysis</h3>
            <p className="text-slate-500 text-sm">
              Detect filler words, pacing issues, and confidence levels.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <BarChart2 className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Detailed Analytics</h3>
            <p className="text-slate-500 text-sm">
              Track your progress and readiness score over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
