import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  BarChart2,
  BookOpen,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Code,
  Server,
  Cloud,
  Home,
  Clock,
  Award,
  ArrowRight,
  RefreshCw,
  Layout,
  LogOut,
  Lock,
  Mail,
  Terminal,
  ArrowLeft,
} from "lucide-react";

// --- 1. DATA & CONFIGURATION ---

const TOPICS = [
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

const QUESTIONS = {
  dsa: [
    "Explain HashMap vs TreeMap.",
    "Detect cycle in linked list.",
    "Explain QuickSort time complexity.",
    "What is a Binary Search Tree?",
  ],
  sys: [
    "Design TinyURL.",
    "Handle DB scaling.",
    "Explain Load Balancing.",
    "SQL vs NoSQL?",
  ],
  hr: [
    "Conflict resolution example?",
    "Where do you see yourself in 5 years?",
    "Greatest weakness?",
    "Describe a challenge you overcame.",
  ],
  fe: [
    "Virtual DOM explained?",
    "useEffect hook usage?",
    "State vs Props?",
    "React Performance Optimization?",
  ],
  be: [
    "Node Event Loop?",
    "Middleware in Express?",
    "JWT vs Sessions?",
    "Microservices pros/cons?",
  ],
  cloud: [
    "What is Docker?",
    "CI/CD Pipeline explained?",
    "AWS S3 vs EC2?",
    "Kubernetes basics?",
  ],
};

// --- 2. UTILITIES & HOOKS ---

// Database Logic (Client-Side Simulation)
const db = {
  getUsers: () => JSON.parse(localStorage.getItem("intelli_users") || "[]"),
  saveUser: (user) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex((u) => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem("intelli_users", JSON.stringify(users));
  },
  findUser: (email, password) => {
    const users = db.getUsers();
    return users.find((u) => u.email === email && u.password === password);
  },
  register: (name, email, password) => {
    const users = db.getUsers();
    if (users.find((u) => u.email === email))
      return { error: "User already exists" };

    const newUser = {
      name,
      email,
      password,
      progress: {},
      totalHours: 0,
      streak: 1,
      joinedAt: new Date().toISOString(),
    };
    db.saveUser(newUser);
    return { user: newUser };
  },
};

// Audio Recorder Hook
const useNativeRecorder = ({ onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        if (onStop) onStop(url, blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access required");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };
  return {
    status: isRecording ? "recording" : "idle",
    startRecording,
    stopRecording,
  };
};

// --- 3. SUB-COMPONENTS ---

const LandingPage = ({ onGetStarted }) => (
  <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center text-white font-sans">
    {/* Background Effects */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>

    {/* Navbar */}
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

    {/* Hero Content */}
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
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105 flex items-center justify-center"
        >
          Start Practicing Now <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Feature Grid */}
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

const AuthScreen = ({ onLoginAttempt, onRegisterAttempt, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      const result = onLoginAttempt(formData.email, formData.password);
      if (result.error) setError(result.error);
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }
      const result = onRegisterAttempt(
        formData.name,
        formData.email,
        formData.password
      );
      if (result.error) setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative font-sans text-white">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-10 flex flex-col justify-between md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[size:20px_20px] opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome <br /> <span className="text-blue-500">Back.</span>
            </h1>
            <p className="text-slate-400 mt-4">
              Login to access your personalized dashboard.
            </p>
          </div>
        </div>
        <div className="p-10 md:w-1/2 bg-slate-950 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-600"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-600"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder-slate-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 mt-4"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ currentView, setView, user, onLogout }) => (
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

const DashboardHome = ({ onNavigate, user }) => {
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

const TopicBrowser = ({ onStartSession }) => (
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

const InterviewSession = ({ topicId, onFinish, onCancel }) => {
  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questionsList = QUESTIONS[topicId] || QUESTIONS["dsa"];
  const question = questionsList[questionIndex % questionsList.length];

  const { status, startRecording, stopRecording } = useNativeRecorder({
    onStop: (url, blob) => handleSubmit(blob),
  });

  useEffect(() => {
    let interval;
    if (status === "recording")
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = async (audioBlob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "interview.wav");

    // Check environment safely
    let API_URL = "http://localhost:5000";
    try {
      if (
        typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_URL
      ) {
        API_URL = import.meta.env.VITE_API_URL;
      }
    } catch (e) {}

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      onFinish(data);
    } catch (error) {
      setTimeout(() => {
        onFinish({
          score: Math.floor(Math.random() * 15) + 80,
          filler_count: Math.floor(Math.random() * 4),
          keywords_found: ["structure", "complexity"],
          transcript: "This is a simulated transcript for the dark mode demo.",
          feedback: "Great structure. Try to be more concise.",
        });
      }, 2000);
    }
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="h-screen bg-slate-950 flex flex-col text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            Back
          </button>
          <span className="text-slate-700">|</span>
          <span className="font-bold text-slate-300 uppercase tracking-wide text-sm">
            {TOPICS.find((t) => t.id === topicId)?.name || "Interview"}
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "recording"
                ? "bg-red-500 animate-pulse"
                : "bg-slate-500"
            }`}
          ></div>
          <span className="font-mono font-medium text-slate-300">
            {formatTime(timer)}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="max-w-4xl w-full text-center space-y-10 z-10">
          <div className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700">
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">
              Question {questionIndex + 1}
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              "{question}"
            </h2>
          </div>
          <div className="flex flex-col items-center space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-blue-400 font-medium animate-pulse">
                  Analyzing...
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  {status === "recording" && (
                    <span className="absolute inset-0 rounded-full bg-red-500/50 animate-ping"></span>
                  )}
                  <button
                    onClick={
                      status === "recording" ? stopRecording : startRecording
                    }
                    className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full shadow-2xl transition-transform transform hover:scale-105 ${
                      status === "recording" ? "bg-red-600" : "bg-blue-600"
                    }`}
                  >
                    {status === "recording" ? (
                      <Square
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                      />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </button>
                </div>
                <p className="text-slate-400 font-medium">
                  {status === "recording" ? "Recording..." : "Tap to Answer"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 text-center">
        <button
          onClick={() => setQuestionIndex((i) => i + 1)}
          className="text-slate-500 hover:text-white text-sm flex items-center justify-center mx-auto space-x-2"
        >
          <RefreshCw className="w-3 h-3" /> <span>Skip</span>
        </button>
      </div>
    </div>
  );
};

const ResultView = ({ data, onTryAgain, onDashboard }) => {
  if (!data) return null;
  return (
    <div className="h-screen bg-slate-950 overflow-y-auto text-white">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <button
              onClick={onDashboard}
              className="text-slate-400 hover:text-white text-sm mb-2 flex items-center"
            >
              <ArrowRight className="w-3 h-3 mr-1 rotate-180" /> Dashboard
            </button>
            <h2 className="text-3xl font-bold">Session Analysis</h2>
          </div>
          <button
            onClick={onTryAgain}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-900/50 flex items-center"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden mb-8 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-blue-500"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 * (1 - data.score / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-extrabold">{data.score}</span>
              </div>
            </div>
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm">
              Overall Score
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2 font-bold text-slate-200">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span>Clarity</span>
              </div>
              <div className="flex justify-between text-sm bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span>Filler Words</span>
                <span className="font-mono font-bold text-orange-500">
                  {data.filler_count}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2 font-bold text-slate-200">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Key Terms</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.keywords_found.map((k, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-xs border border-green-900"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-950/50">
            <h3 className="font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 text-purple-500 mr-2" /> AI Feedback
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {data.feedback}
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 italic">
              "{data.transcript}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. MAIN APP CONTROLLER ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");
  const [activeTopic, setActiveTopic] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  // Check Session on Load
  useEffect(() => {
    const savedUser = sessionStorage.getItem("intelli_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView("dashboard");
    }
  }, []);

  // --- Auth Handlers ---
  const handleLoginAttempt = (email, password) => {
    const foundUser = db.findUser(email, password);
    if (foundUser) {
      sessionStorage.setItem("intelli_user", JSON.stringify(foundUser));
      setUser(foundUser);
      setView("dashboard");
      return { success: true };
    }
    return { error: "Invalid email or password" };
  };

  const handleRegisterAttempt = (name, email, password) => {
    const result = db.register(name, email, password);
    if (result.user) {
      sessionStorage.setItem("intelli_user", JSON.stringify(result.user));
      setUser(result.user);
      setView("dashboard");
      return { success: true };
    }
    return { error: result.error };
  };

  const handleLogout = () => {
    sessionStorage.removeItem("intelli_user");
    setUser(null);
    setView("landing");
  };

  const handleFinishSession = (data) => {
    setSessionData(data);
    setView("result");

    if (user && activeTopic) {
      const updatedUser = { ...user };
      if (!updatedUser.progress) updatedUser.progress = {};
      updatedUser.progress[activeTopic] =
        (updatedUser.progress[activeTopic] || 0) + 1;
      updatedUser.totalHours = (updatedUser.totalHours || 0) + 0.5;

      db.saveUser(updatedUser);
      sessionStorage.setItem("intelli_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // --- Router ---

  if (view === "landing") {
    return <LandingPage onGetStarted={() => setView("auth")} />;
  }

  if (view === "auth") {
    return (
      <AuthScreen
        onLoginAttempt={handleLoginAttempt}
        onRegisterAttempt={handleRegisterAttempt}
        onBack={() => setView("landing")}
      />
    );
  }

  return (
    <div className="font-sans bg-slate-950 min-h-screen flex">
      {(view === "dashboard" || view === "topics") && (
        <Sidebar
          currentView={view}
          setView={setView}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <main
        className={`flex-1 ${
          view === "dashboard" || view === "topics" ? "md:ml-64" : ""
        }`}
      >
        {view === "dashboard" && (
          <DashboardHome onNavigate={setView} user={user} />
        )}
        {view === "topics" && (
          <TopicBrowser
            onStartSession={(id) => {
              setActiveTopic(id);
              setView("session");
            }}
          />
        )}
        {view === "session" && (
          <InterviewSession
            topicId={activeTopic}
            onFinish={handleFinishSession}
            onCancel={() => setView("topics")}
          />
        )}
        {view === "result" && (
          <ResultView
            data={sessionData}
            onTryAgain={() => setView("session")}
            onDashboard={() => setView("dashboard")}
          />
        )}
      </main>
    </div>
  );
}
