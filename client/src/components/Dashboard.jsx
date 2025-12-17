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
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    questionsCount: 12,
  },
  {
    id: "sys",
    name: "System Design",
    description: "Scalability, Sharding",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    questionsCount: 8,
  },
  {
    id: "hr",
    name: "Behavioral (HR)",
    description: "Leadership, Culture",
    icon: <User className="w-6 h-6" />,
    color: "bg-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    questionsCount: 15,
  },
  {
    id: "fe",
    name: "Frontend React",
    description: "Hooks, DOM",
    icon: <Layout className="w-6 h-6" />,
    color: "bg-pink-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    questionsCount: 10,
  },
  {
    id: "be",
    name: "Backend Node",
    description: "Event Loop, API",
    icon: <Server className="w-6 h-6" />,
    color: "bg-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    questionsCount: 9,
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    description: "AWS, CI/CD",
    icon: <Cloud className="w-6 h-6" />,
    color: "bg-cyan-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
    questionsCount: 7,
  },
];

export const Sidebar = ({ currentView, setView, user, onLogout }) => (
  <div className="w-64 bg-slate-50 border-r border-slate-200 text-slate-600 flex flex-col h-screen fixed left-0 top-0 z-10 hidden md:flex font-sans">
    <div className="p-8 border-b border-slate-200/50">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-extrabold tracking-tight text-black">
          Intelli-Prep
        </span>
      </div>
    </div>
    <nav className="flex-1 p-4 space-y-2 mt-4">
      <button
        onClick={() => setView("dashboard")}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
          currentView === "dashboard"
            ? "bg-black text-white shadow-lg shadow-slate-200"
            : "hover:bg-white hover:shadow-sm text-slate-500"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Dashboard</span>
      </button>
      <button
        onClick={() => setView("topics")}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
          currentView === "topics"
            ? "bg-black text-white shadow-lg shadow-slate-200"
            : "hover:bg-white hover:shadow-sm text-slate-500"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Practice Topics</span>
      </button>
    </nav>
    <div className="p-4 border-t border-slate-200/50">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 flex items-center space-x-3">
         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
          {user.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
           <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
           <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl transition-colors text-sm border border-slate-200 font-medium"
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
    <div className="p-8 md:p-12 max-w-7xl mx-auto font-sans">
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {user.name.split(" ")[0]}!
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          Your preparation streak is on fire 🔥
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center space-x-6">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900">
              {user.totalHours || 0}
            </p>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wide">Hours Practiced</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center space-x-6">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900">{totalSolved}</p>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wide">Questions Solved</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center space-x-6">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900">{user.streak || 1}</p>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wide">Day Streak</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Continue Learning</h3>
          <button onClick={() => onNavigate("topics")} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="text-left p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`inline-flex p-4 rounded-2xl ${topic.bgColor} ${topic.textColor}`}
                >
                  {topic.icon}
                </div>
                <span className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full">
                  {percent}%
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {topic.name}
              </h4>
             
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-6">
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
  <div className="p-8 md:p-12 max-w-7xl mx-auto font-sans">
    <header className="mb-12">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select a Topic</h2>
      <p className="text-slate-500 mt-2 text-lg">
        Choose a domain to start your mock interview session.
      </p>
    </header>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onStartSession(topic.id)}
          className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left"
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-2xl ${topic.bgColor} ${topic.textColor}`}>
              {topic.icon}
            </div>
            <span className="bg-slate-50 text-slate-500 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
              {topic.questionsCount} Qs
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {topic.name}
          </h3>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">{topic.description}</p>
          <div className="flex items-center text-blue-600 font-bold text-sm">
            Start Practice <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  </div>
);
