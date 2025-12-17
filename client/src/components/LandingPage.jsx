import React from "react";
import { Instagram, Linkedin, X, ChevronRight } from "lucide-react";
import heroImage from "../assets/hero-image.png";
import featureCode from "../assets/feature-code.png";
import featureAudio from "../assets/feature-audio.png";
import featureChart from "../assets/feature-chart.png";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-2">
              {/* Logo Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black"
              >
                <path
                  d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xl font-bold tracking-tight">Sai Suraj</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-black transition-colors">
                One Company
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Search Analysis
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Recent Program
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <a href="#" className="hover:text-black transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-black transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-black transition-colors">
              <X className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Master Your <br />
            Technical Interview
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
            Practice Data Structures, System Design, and Behavioral questions with
            an AI that listens, analyzes, and gives real-time feedback.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              Get started
            </button>
            <button className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-all">
              Explore topics
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50">
           {/* Browser Window Chrome */}
           <div className="h-8 bg-slate-100 flex items-center px-4 space-x-2 border-b border-slate-200">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <img
              src={heroImage}
              alt="Interview Practice"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-slate-100/50 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 border border-transparent hover:border-slate-100">
              <h3 className="text-xl font-bold mb-3">Live Coding Prep</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Practice DSA questions with voice-to-code analysis.
              </p>
              <div className="rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <img
                  src={featureCode}
                  alt="Live Coding"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-100/50 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 border border-transparent hover:border-slate-100">
              <h3 className="text-xl font-bold mb-3">Speech Analysis</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Detect filler words, pacing issues, and confidence levels.
              </p>
              <div className="rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <img
                  src={featureAudio}
                  alt="Speech Analysis"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-100/50 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 border border-transparent hover:border-slate-100">
              <h3 className="text-xl font-bold mb-3">Detailed Analysis</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Track your progress and readiness score over time.
              </p>
              <div className="rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <img
                  src={featureChart}
                  alt="Detailed Analysis"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-bold text-lg mb-4">Intelli-Prep</h4>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Intelli-Prep is an AI-powered platform designed to help job
              seekers prepare for interviews with personalized mock sessions,
              real-time simulations, and smart feedback—tailored to the job,
              company, and candidate profile.
            </p>
            <div className="flex space-x-4 mt-6 text-slate-400">
              <Instagram className="w-5 h-5 hover:text-black cursor-pointer" />
              <Linkedin className="w-5 h-5 hover:text-black cursor-pointer" />
              <X className="w-5 h-5 hover:text-black cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6">Features</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black">Core features</a></li>
              <li><a href="#" className="hover:text-black">Pro experience</a></li>
              <li><a href="#" className="hover:text-black">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6">Learn more</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black">Blog</a></li>
              <li><a href="#" className="hover:text-black">Case studies</a></li>
              <li><a href="#" className="hover:text-black">Customer stories</a></li>
              <li><a href="#" className="hover:text-black">Best practices</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black">Contact</a></li>
              <li><a href="#" className="hover:text-black">Support</a></li>
              <li><a href="#" className="hover:text-black">Legal</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
