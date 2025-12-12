import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Award,
} from "lucide-react";
import { TOPICS } from "./Dashboard"; // Import topics to get names

// --- Questions Data ---
const QUESTIONS = {
  dsa: [
    "Explain HashMap vs TreeMap.",
    "Detect cycle in linked list.",
    "Explain QuickSort.",
  ],
  sys: ["Design TinyURL.", "Handle DB scaling.", "Explain Load Balancing."],
  hr: [
    "Conflict resolution example?",
    "Where do you see yourself in 5 years?",
    "Greatest weakness?",
  ],
  fe: ["Virtual DOM?", "useEffect hook?", "State vs Props?"],
  be: ["Node Event Loop?", "Middleware?", "JWT vs Sessions?"],
  cloud: ["What is Docker?", "CI/CD Pipeline?", "AWS S3 vs EC2?"],
};

// --- Recorder Hook ---
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

export const InterviewSession = ({ topicId, onFinish, onCancel }) => {
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

    // Simulate API call for Demo
    setTimeout(() => {
      onFinish({
        score: Math.floor(Math.random() * 15) + 80,
        filler_count: Math.floor(Math.random() * 4),
        keywords_found: ["structure", "complexity"],
        transcript: "This is a simulated transcript for the dark mode demo.",
        feedback: "Great structure. Try to be more concise.",
      });
    }, 2000);
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
            {TOPICS.find((t) => t.id === topicId)?.name}
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

export const ResultView = ({ data, onTryAgain, onDashboard }) => {
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
