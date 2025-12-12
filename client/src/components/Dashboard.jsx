import React from "react";
import {
  Home,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  LogOut,
  ArrowRight,
  Code,
  BarChart2,
  User,
  Layout,
  Server,
  Cloud,
} from "lucide-react";

export const TOPICS = [
  {
    id: "dsa",
    name: "Data Structures",
    description: "Arrays, Trees, Graphs",
    icon: <Code className="w-6 h-6" />,
    color: "bg-blue-600",
    questionsCount: 12,
  },
  {
    id: "sys",
    name: "System Design",
    description: "Scalability, Sharding",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-600",
    questionsCount: 8,
  },
  {
    id: "hr",
    name: "Behavioral (HR)",
    description: "Leadership, Culture",
    icon: <User className="w-6 h-6" />,
    color: "bg-green-600",
    questionsCount: 15,
  },
  {
    id: "fe",
    name: "Frontend React",
    description: "Hooks, DOM",
    icon: <Layout className="w-6 h-6" />,
    color: "bg-pink-600",
    questionsCount: 10,
  },
  {
    id: "be",
    name: "Backend Node",
    description: "Event Loop, API",
    icon: <Server className="w-6 h-6" />,
    color: "bg-orange-600",
    questionsCount: 9,
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    description: "AWS, CI/CD",
    icon: <Cloud className="w-6 h-6" />,
    color: "bg-cyan-600",
    questionsCount: 7,
  },
];

export const Sidebar = ({ currentView, setView, user, onLogout }) => (
  <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-10 hidden md:flex">
    <div className="p-6 border-b border-slate-800">
      <h1 className="text-2xl font-extrabold text-white tracking-tight">
        Intelli<span className="text-blue-500">Prep</span>
      </h1>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <button
        onClick={() => setView("dashboard")}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
          currentView === "dashboard"
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-800"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Dashboard</span>
      </button>
      <button
        onClick={() => setView("topics")}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
          currentView === "topics"
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-800"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">Practice Topics</span>
      </button>
    </nav>
    <div className="p-4 border-t border-slate-800">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-400 rounded-lg transition-colors text-sm border border-slate-700"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  </div>
);

export const DashboardHome = ({ onNavigate, user }) => {
  const totalSolved = Object.values(user.progress || {}).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          Welcome, {user.name.split(" ")[0]}!
        </h2>
        <p className="text-slate-400 mt-1">
          Your preparation streak is on fire 🔥
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {user.totalHours || 0}
            </p>
            <p className="text-sm text-slate-500">Hours Practiced</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-green-900/30 text-green-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalSolved}</p>
            <p className="text-sm text-slate-500">Questions Solved</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-purple-900/30 text-purple-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{user.streak || 1}</p>
            <p className="text-sm text-slate-500">Day Streak</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.slice(0, 3).map((topic) => {
          const solved = user.progress?.[topic.id] || 0;
          const percent = Math.min(
            100,
            Math.round((solved / topic.questionsCount) * 100)
          );
          return (
            <button
              key={topic.id}
              onClick={() => onNavigate("topics")}
              className="text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`inline-flex p-3 rounded-lg ${topic.color} text-white`}
                >
                  {topic.icon}
                </div>
                <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {percent}%
                </span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {topic.name}
              </h4>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                <div
                  className={`h-full ${topic.color}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const TopicBrowser = ({ onStartSession }) => (
  <div className="p-8">
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-white">Select a Topic</h2>
      <p className="text-slate-400">
        Choose a domain to start your mock interview.
      </p>
    </header>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onStartSession(topic.id)}
          className="group relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 transition-all text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${topic.color} text-white`}>
              {topic.icon}
            </div>
            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full font-medium">
              {topic.questionsCount} Qs
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {topic.name}
          </h3>
          <p className="text-sm text-slate-500 mb-6">{topic.description}</p>
          <div className="flex items-center text-blue-400 font-bold text-sm opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            Start Practice <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </button>
      ))}
    </div>
  </div>
);
