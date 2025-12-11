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
} from "lucide-react";

// --- Configuration ---
const TOPICS = [
  {
    id: "dsa",
    name: "Data Structures",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-blue-500",
  },
  {
    id: "sys",
    name: "System Design",
    icon: <BarChart2 className="w-5 h-5" />,
    color: "bg-purple-500",
  },
  {
    id: "hr",
    name: "Behavioral (HR)",
    icon: <User className="w-5 h-5" />,
    color: "bg-green-500",
  },
];

const QUESTIONS = {
  dsa: [
    "Explain the difference between a HashMap and a TreeMap.",
    "How would you detect a cycle in a linked list?",
  ],
  sys: [
    "Design a URL shortening service like TinyURL.",
    "How would you handle database scaling?",
  ],
  hr: [
    "Tell me about a time you faced a conflict in a team.",
    "Where do you see yourself in 5 years?",
  ],
};

// --- Custom Hook for Native Audio Recording (No External Libs needed) ---
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

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      recorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert(
        "Microphone access is required to use this app. Please check your browser settings."
      );
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

const LandingPage = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
    <div className="max-w-4xl w-full text-center space-y-8">
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
        Intelli<span className="text-blue-600">Prep</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        The AI-powered interview coach. Select a topic to begin.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onStart(topic.id)}
            className="group relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 text-left"
          >
            <div
              className={`inline-flex items-center justify-center p-3 rounded-xl ${topic.color} text-white mb-4`}
            >
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {topic.name}
            </h3>
            <div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Start Session <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const InterviewSession = ({ topicId, onFinish }) => {
  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use our native recorder hook
  const { status, startRecording, stopRecording } = useNativeRecorder({
    onStop: (url, blob) => handleSubmit(blob),
  });

  const question = QUESTIONS[topicId][0]; // Just take first question for demo

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
    // 'interview.wav' is the filename the backend will see
    formData.append("audio", audioBlob, "interview.wav");

    try {
      // NOTE: Ensure your backend is running at this address
      // Use the deployed URL if available, otherwise use localhost
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      onFinish(data);
    } catch (error) {
      console.error("Error sending audio:", error);
      // Fallback for demo purposes if backend isn't running
      alert(
        "Could not connect to backend at localhost:5000. Displaying mock data for demo."
      );
      onFinish({
        score: 85,
        filler_count: 3,
        keywords_found: ["complexity", "optimization"],
        transcript:
          "This is a mock transcript because the backend connection failed.",
        feedback: "Great pacing, but check your backend connection.",
      });
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="uppercase text-xs font-bold tracking-wider">
              Status: {status}
            </span>
            {status === "recording" && (
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            )}
          </div>
          <div className="font-mono text-xl text-slate-300">
            {formatTime(timer)}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 text-center">
          <h2 className="text-2xl font-medium leading-relaxed">"{question}"</h2>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <div className="text-blue-400 animate-pulse text-xl font-bold">
              AI is Analyzing your answer...
            </div>
          ) : (
            <button
              onClick={status === "recording" ? stopRecording : startRecording}
              className={`relative group flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-lg ${
                status === "recording"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {status === "recording" ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
          )}
          <p className="text-slate-500 text-sm">
            {status === "recording" ? "Listening..." : "Press mic to start"}
          </p>
        </div>
      </div>
    </div>
  );
};

const FeedbackReport = ({ data, onHome }) => {
  if (!data) return null;
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Analysis Results
          </h2>
          <button
            onClick={onHome}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            Try Another
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-slate-500 text-sm font-medium uppercase mb-2">
              AI Score
            </span>
            <span className="text-5xl font-bold text-blue-600">
              {Math.round(data.score)}
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-700">Filler Words</h3>
            </div>
            <p className="text-slate-600">
              You used filler words <strong>{data.filler_count}</strong> times.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-slate-700">Keywords Detected</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keywords_found && data.keywords_found.length > 0 ? (
                data.keywords_found.map((k, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    {k}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-sm">
                  No specific technical keywords found.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-2">Transcript</h3>
          <p className="text-slate-600 italic">"{data.transcript}"</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-1">Feedback:</h4>
            <p className="text-sm text-blue-700">{data.feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("landing");
  const [activeTopic, setActiveTopic] = useState(null);
  const [aiData, setAiData] = useState(null);

  const startSession = (topicId) => {
    setActiveTopic(topicId);
    setView("session");
  };
  const finishSession = (data) => {
    setAiData(data);
    setView("feedback");
  };
  const goHome = () => {
    setView("landing");
    setActiveTopic(null);
    setAiData(null);
  };

  return (
    <div className="font-sans">
      {view === "landing" && <LandingPage onStart={startSession} />}
      {view === "session" && (
        <InterviewSession topicId={activeTopic} onFinish={finishSession} />
      )}
      {view === "feedback" && <FeedbackReport data={aiData} onHome={goHome} />}
    </div>
  );
}
