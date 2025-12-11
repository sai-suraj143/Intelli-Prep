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
} from "lucide-react";

// --- V2 Configuration: Expanded Content ---
const TOPICS = [
  {
    id: "dsa",
    name: "Data Structures",
    description: "Arrays, Trees, Graphs & Algorithms",
    icon: <Code className="w-6 h-6" />,
    color: "bg-blue-600",
    bg: "bg-blue-50",
    questionsCount: 12,
  },
  {
    id: "sys",
    name: "System Design",
    description: "Scalability, Load Balancing, DB Sharding",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "bg-purple-600",
    bg: "bg-purple-50",
    questionsCount: 8,
  },
  {
    id: "hr",
    name: "Behavioral (HR)",
    description: "Leadership, Conflict & Culture Fit",
    icon: <User className="w-6 h-6" />,
    color: "bg-green-600",
    bg: "bg-green-50",
    questionsCount: 15,
  },
  {
    id: "fe",
    name: "Frontend React",
    description: "Hooks, DOM, State Management",
    icon: <Layout className="w-6 h-6" />,
    color: "bg-pink-600",
    bg: "bg-pink-50",
    questionsCount: 10,
  },
  {
    id: "be",
    name: "Backend Node",
    description: "Event Loop, Express, Microservices",
    icon: <Server className="w-6 h-6" />,
    color: "bg-orange-600",
    bg: "bg-orange-50",
    questionsCount: 9,
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    description: "AWS, Docker, CI/CD Pipelines",
    icon: <Cloud className="w-6 h-6" />,
    color: "bg-cyan-600",
    bg: "bg-cyan-50",
    questionsCount: 7,
  },
];

const QUESTIONS = {
  dsa: [
    "Explain the difference between a HashMap and a TreeMap.",
    "How would you detect a cycle in a linked list?",
    "Explain the QuickSort algorithm and its time complexity.",
    "What is a Binary Search Tree and when is it useful?",
    "How does a Stack differ from a Queue?",
  ],
  sys: [
    "Design a URL shortening service like TinyURL.",
    "How would you handle database scaling for a social media app?",
    "Explain the concept of Load Balancing.",
    "What is the difference between SQL and NoSQL databases?",
    "How would you design a rate limiter?",
  ],
  hr: [
    "Tell me about a time you faced a conflict in a team.",
    "Where do you see yourself in 5 years?",
    "What is your greatest weakness?",
    "Describe a challenging project you worked on.",
    "Why do you want to work for our company?",
  ],
  fe: [
    "What is the Virtual DOM in React?",
    "Explain the useEffect hook dependency array.",
    "What is the difference between State and Props?",
    "How do you optimize a React application?",
  ],
  be: [
    "Explain the Node.js Event Loop.",
    "What is the difference between blocking and non-blocking I/O?",
    "How does Middleware work in Express.js?",
    "Explain the concept of JWT (JSON Web Tokens).",
  ],
  cloud: [
    "What is Docker and how does it help development?",
    "Explain the concept of CI/CD.",
    "What is the difference between IaaS and PaaS?",
    "How does a Load Balancer work in AWS?",
  ],
};

// --- Custom Hook for Native Audio Recording ---
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
      console.error("Microphone access denied:", err);
      alert("Microphone access is required to use this app.");
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

// --- Components ---

const Sidebar = ({ currentView, setView }) => (
  <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 shadow-xl z-10 hidden md:flex">
    <div className="p-6 border-b border-slate-800">
      <h1 className="text-2xl font-extrabold text-white tracking-tight">
        Intelli<span className="text-blue-500">Prep</span>
        <span className="text-xs ml-1 font-mono text-slate-500">v2.0</span>
      </h1>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <button
        onClick={() => setView("dashboard")}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
          currentView === "dashboard"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
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
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
            : "hover:bg-slate-800"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="font-medium">Topics & Practice</span>
      </button>
      <div className="pt-4 mt-4 border-t border-slate-800">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          History
        </p>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-400">
          <Clock className="w-5 h-5" />
          <span>Recent Sessions</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-400">
          <Award className="w-5 h-5" />
          <span>Achievements</span>
        </button>
      </div>
    </nav>
    <div className="p-4 border-t border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          JD
        </div>
        <div>
          <p className="text-sm font-bold text-white">John Doe</p>
          <p className="text-xs text-slate-500">Pro Member</p>
        </div>
      </div>
    </div>
  </div>
);

const DashboardHome = ({ onNavigate }) => (
  <div className="p-8">
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900">Welcome back, John!</h2>
      <p className="text-slate-500 mt-1">
        You're on a 3-day streak. Keep it up!
      </p>
    </header>

    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">12</p>
          <p className="text-sm text-slate-500">Hours Practiced</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">45</p>
          <p className="text-sm text-slate-500">Questions Solved</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">Top 10%</p>
          <p className="text-sm text-slate-500">Global Rank</p>
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-slate-800">Quick Start</h3>
      <button
        onClick={() => onNavigate("topics")}
        className="text-blue-600 font-medium hover:underline"
      >
        View All Topics
      </button>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TOPICS.slice(0, 3).map((topic) => (
        <button
          key={topic.id}
          onClick={() => onNavigate("topics")}
          className={`text-left p-6 rounded-2xl transition-all hover:shadow-md border border-slate-100 ${topic.bg}`}
        >
          <div
            className={`inline-flex p-3 rounded-lg ${topic.color} text-white mb-4`}
          >
            {topic.icon}
          </div>
          <h4 className="text-lg font-bold text-slate-900">{topic.name}</h4>
          <p className="text-sm text-slate-600 mt-1 mb-4">
            {topic.questionsCount} Questions available
          </p>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${topic.color} opacity-50`}
              style={{ width: "40%" }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">40% Completed</p>
        </button>
      ))}
    </div>
  </div>
);

const TopicBrowser = ({ onStartSession }) => (
  <div className="p-8">
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900">Select a Topic</h2>
      <p className="text-slate-500 mt-1">
        Choose a domain to start your mock interview session.
      </p>
    </header>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onStartSession(topic.id)}
          className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${topic.color} text-white`}>
              {topic.icon}
            </div>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
              {topic.questionsCount} Qs
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
            {topic.name}
          </h3>
          <p className="text-sm text-slate-500 mb-6">{topic.description}</p>
          <div className="flex items-center text-blue-600 font-bold text-sm opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
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

  // Pick random questions from the pool or cycle through
  const questionsList = QUESTIONS[topicId];
  const question = questionsList[questionIndex % questionsList.length];

  const { status, startRecording, stopRecording } = useNativeRecorder({
    onStop: (url, blob) => handleSubmit(blob),
  });

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = async (audioBlob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "interview.wav");

    // Dynamic URL for deployed vs local - Safe Check for import.meta.env
    let API_URL = "http://localhost:5000";
    try {
      if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
        API_URL = import.meta.env.VITE_API_URL;
      }
    } catch (e) {
      // Fallback to localhost if import.meta fails
      API_URL = "http://localhost:5000";
    }

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      onFinish(data);
    } catch (error) {
      // Fallback for demo
      setTimeout(() => {
        onFinish({
          score: Math.floor(Math.random() * 20) + 75,
          filler_count: Math.floor(Math.random() * 5),
          keywords_found: ["optimization", "complexity", "structure"],
          transcript:
            "This is a simulated transcript because the backend is not connected. I explained the concept using time complexity and optimization.",
          feedback:
            "Good attempt! You covered the basics but could improve on structuring your answer with more examples.",
        });
      }, 2000);
    }
  };

  const nextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            Back
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-700 uppercase tracking-wide text-sm">
            {TOPICS.find((t) => t.id === topicId)?.name} Interview
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "recording"
                ? "bg-red-500 animate-pulse"
                : "bg-slate-400"
            }`}
          ></div>
          <span className="font-mono font-medium text-slate-600">
            {formatTime(timer)}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-4xl w-full text-center space-y-10 z-0">
          <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-white/50">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">
              Question {questionIndex + 1}
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
              "{question}"
            </h2>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-blue-600 font-medium animate-pulse">
                  Analyzing content, pacing, and tone...
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  {status === "recording" && (
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
                  )}
                  <button
                    onClick={
                      status === "recording" ? stopRecording : startRecording
                    }
                    className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full shadow-2xl transition-transform transform hover:scale-105 ${
                      status === "recording"
                        ? "bg-gradient-to-br from-red-500 to-red-600"
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
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
                <p className="text-slate-500 font-medium">
                  {status === "recording"
                    ? "Recording in progress..."
                    : "Tap microphone to answer"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 text-center">
        <button
          onClick={nextQuestion}
          className="text-slate-400 hover:text-slate-600 text-sm flex items-center justify-center mx-auto space-x-2"
        >
          <RefreshCw className="w-3 h-3" /> <span>Skip this question</span>
        </button>
      </div>
    </div>
  );
};

const ResultView = ({ data, onTryAgain, onDashboard }) => {
  if (!data) return null;
  return (
    <div className="h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <button
              onClick={onDashboard}
              className="text-slate-400 hover:text-slate-600 text-sm mb-2 flex items-center"
            >
              <ArrowRight className="w-3 h-3 mr-1 rotate-180" /> Back to
              Dashboard
            </button>
            <h2 className="text-3xl font-bold text-slate-900">
              Session Analysis
            </h2>
          </div>
          <button
            onClick={onTryAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-200 transition-all flex items-center"
          >
            Next Question <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Score Card Main */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Overall Score */}
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
                    className="text-slate-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className={`text-blue-500`}
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 * (1 - data.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-extrabold text-slate-800">
                    {data.score}
                  </span>
                </div>
              </div>
              <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm">
                Overall Score
              </h3>
            </div>

            {/* Stats */}
            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2 text-slate-800 font-bold">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span>Speech Clarity</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <span>Filler Words Used</span>
                  <span className="font-mono font-bold text-orange-600">
                    {data.filler_count}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2 text-slate-800 font-bold">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Key Terms</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.keywords_found && data.keywords_found.length > 0 ? (
                    data.keywords_found.map((k, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200"
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">
                      No keywords detected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="p-8 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Award className="w-5 h-5 text-purple-500 mr-2" /> AI Feedback
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {data.feedback}
              </p>
              <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs text-slate-500 italic">
                "{data.transcript}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("dashboard"); // dashboard, topics, session, result
  const [activeTopic, setActiveTopic] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  const navigateTo = (v) => setView(v);

  const startSession = (topicId) => {
    setActiveTopic(topicId);
    setView("session");
  };

  const finishSession = (data) => {
    setSessionData(data);
    setView("result");
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen flex">
      {/* Sidebar only visible on dashboard/topics views */}
      {(view === "dashboard" || view === "topics") && (
        <Sidebar currentView={view} setView={navigateTo} />
      )}

      <main
        className={`flex-1 ${
          view === "dashboard" || view === "topics" ? "md:ml-64" : ""
        }`}
      >
        {view === "dashboard" && <DashboardHome onNavigate={navigateTo} />}
        {view === "topics" && <TopicBrowser onStartSession={startSession} />}
        {view === "session" && (
          <InterviewSession
            topicId={activeTopic}
            onFinish={finishSession}
            onCancel={() => navigateTo("topics")}
          />
        )}
        {view === "result" && (
          <ResultView
            data={sessionData}
            onTryAgain={() => setView("session")} // Loops back to same topic, new question logic handles rotation
            onDashboard={() => navigateTo("dashboard")}
          />
        )}
      </main>
    </div>
  );
}
