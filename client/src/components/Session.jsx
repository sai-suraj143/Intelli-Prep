import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  ChevronRight,
  RefreshCw,
  Home,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  BarChart2,
  Volume2,
  Cpu,
} from "lucide-react";
import { TOPICS } from "./Dashboard";

// --- Hook for Native Media Recorder ---
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
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (onStop) onStop(url, blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
};

// --- Mock Questions Data ---
const QUESTIONS = {
  dsa: [
    "Explain the difference between an array and a linked list.",
    "How does a hash map work?",
    "What is the time complexity of quicksort?",
    "Explain the concept of dynamic programming.",
  ],
  sys: [
    "Design a URL shortening service like bit.ly.",
    "How would you design a rate limiter?",
    "Explain the CAP theorem.",
    "What is the difference between horizontal and vertical scaling?",
  ],
  hr: [
    "Tell me about a time you failed.",
    "Where do you see yourself in 5 years?",
    "Why do you want to work here?",
    "Describe a conflict you faced in a team and how you resolved it.",
  ],
  fe: [
    "What is the Virtual DOM?",
    "Explain React Hooks and why they are used.",
    "What is the difference between state and props?",
    "How does CSS Flexbox work?",
  ],
  be: [
    "Explain the Node.js event loop.",
    "What is middleware in Express?",
    "sql vs nosql databases?",
    "How do you handle authentication in an API?",
  ],
  cloud: [
    "What is Docker and how is it used?",
    "Explain CI/CD pipelines.",
    "What is serverless computing?",
    "Difference between IaaS, PaaS, and SaaS?",
  ],
};

export const InterviewSession = ({ topicId, onFinish, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [timer, setTimer] = useState(0); // in seconds
  const timerRef = useRef(null);

  const topic = TOPICS.find((t) => t.id === topicId);
  const questions = QUESTIONS[topicId] || QUESTIONS.dsa;
  const currentQuestion = questions[currentQuestionIndex];

  // Custom recorder hook
  const { isRecording, startRecording, stopRecording } = useNativeRecorder({
    onStop: (url, blob) => handleRecordingStop(url, blob),
  });

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRecordingStop = async (audioUrl, audioBlob) => {
    setAnalyzing(true);
    
    // Simulate API analysis
    try {
      // Simulating response for now to work without backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fillerCount = Math.floor(Math.random() * 8); // 0 to 7 fillers
      const score = Math.max(1, 10 - fillerCount - Math.floor(Math.random() * 2)); // Score drops with more fillers
      const confidenceScore = score > 8 ? "High" : score > 5 ? "Medium" : "Low"; 

      // Simulate English Language Filter
      // In a real app, the API would return an error if language !== 'en'
      console.log("Analyzing audio for English language content...");

      const mockResult = {
        question: currentQuestion,
        transcript: "This is a simulated transcript of the user's answer. It contains technical terms like Big O Notation and Recursion.",
        feedback: fillerCount > 3 
          ? "Your answer was correct but contained too many filler words. Try to pause instead of saying 'um' or 'uh'."
          : "Excellent clear delivery. You explained the concepts well with good pacing.",
        score: score, 
        audioUrl,
        duration: 30, // Duration of the answer recording (mocked 30s)
        fillerCount: fillerCount,
        confidence: confidenceScore,
        pacing: "Good",
      };

      const newAnswers = [...answers, mockResult];
      setAnswers(newAnswers);
      setAnalyzing(false);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        onFinish({
          topic: topic.name,
          date: new Date().toLocaleDateString(),
          score: Math.round(newAnswers.reduce((acc, curr) => acc + curr.score, 0) / newAnswers.length),
          answers: newAnswers,
          duration: timer, // Total session duration from the main timer
        });
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalyzing(false);
      alert("Analysis failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="px-8 py-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className={`p-2.5 rounded-xl ${topic.bgColor} ${topic.textColor}`}>
            {topic.icon}
          </div>
          <div>
            <h2 className="font-bold text-lg">{topic.name}</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-slate-500 font-mono text-sm bg-slate-100 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timer)}</span>
          </div>
          <button
            onClick={onCancel}
            className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 flex flex-col justify-center items-center">
        {analyzing ? (
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
               <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping"></div>
              <Cpu className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">Analyzing your answer...</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Our AI is checking your technical accuracy, clarity, and confidence.
              Sit tight!
            </p>
          </div>
        ) : (
          <div className="w-full text-center space-y-12">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-sm font-bold tracking-wide uppercase">
                {topic.name} Interview
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
                {currentQuestion}
              </h1>
            </div>

            {/* Visualizer / Waveform Placeholder */}
            <div className="h-32 flex items-center justify-center space-x-1.5">
              {isRecording ? (
                // Animated bars for recording state
                [...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-black rounded-full animate-wave"
                    style={{
                      height: `${Math.max(20, Math.random() * 100)}%`,
                      animationDelay: `${i * 0.05}s`,
                      animationDuration: '0.8s'
                    }}
                  ></div>
                ))
              ) : (
                 <div className="text-slate-300 flex items-center space-x-2">
                    <Volume2 className="w-6 h-6" />
                    <span className="text-sm font-medium">Ready to record</span>
                 </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`
                  relative group flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 shadow-2xl
                  ${isRecording 
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/30 scale-110" 
                    : "bg-black hover:bg-slate-800 shadow-slate-400/50 hover:scale-105"
                  }
                `}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-white fill-current" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
                
                {/* Ring animation when not recording to prompt user */}
                {!isRecording && (
                    <span className="absolute inset-0 rounded-full border border-slate-300 animate-ping opacity-25"></span>
                )}
              </button>
            </div>
            
            <p className="text-slate-400 font-medium text-sm">
                {isRecording ? "Listening... Tap to stop." : "Tap the microphone to start answering. (English Only)"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export const ResultView = ({ data, onTryAgain, onDashboard }) => {
  // Calculate average confidence from answers if available, otherwise mock
  // But here we rely on the specific confidence of the last answer or aggregated? 
  // Let's use the aggregated score to determine overall confidence
  const overallConfidence = data.score >= 8 ? "High" : data.score >= 5 ? "Medium" : "Low";
  const confidenceColor = data.score >= 8 ? "text-green-600" : data.score >= 5 ? "text-yellow-600" : "text-red-600";
  const avgFillers = (data.answers.reduce((acc, curr) => acc + curr.fillerCount, 0) / data.answers.length).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-full mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Interview Completed!</h1>
          <p className="text-slate-500 text-lg">
            Here's how you performed in the <span className="font-bold text-black">{data.topic}</span> session.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Overall Score Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center col-span-1 md:col-span-1">
             <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                {/* Circular Progress Placeholder */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                    <circle 
                        cx="80" cy="80" r="70" stroke={data.score >= 8 ? "#16a34a" : data.score >= 5 ? "#eab308" : "#dc2626"} 
                        strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * data.score) / 10} 
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold">{data.score}</span>
                    <span className="text-slate-400 text-sm font-medium uppercase mt-1">/ 10</span>
                </div>
             </div>
             <h3 className="text-xl font-bold mb-2">Overall Score</h3>
             <p className="text-slate-500 text-sm">Based on accuracy & delivery</p>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Clock className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Duration</p>
                      <p className="text-2xl font-extrabold mt-1">{Math.floor(data.duration / 60)}m {data.duration % 60}s</p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                      <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Questions</p>
                      <p className="text-2xl font-extrabold mt-1">{data.answers.length} Solved</p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                      <Mic className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Avg. Fillers</p>
                      <p className="text-2xl font-extrabold mt-1">{avgFillers} <span className="text-xs font-normal text-slate-400">/ answer</span></p>
                  </div>
              </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-4">
                  <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                      <Award className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Confidence</p>
                      <p className={`text-2xl font-extrabold mt-1 ${confidenceColor}`}>{overallConfidence}</p>
                  </div>
              </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <h3 className="text-2xl font-bold mb-8 text-black">Question Breakdown</h3>
        <div className="space-y-6">
          {data.answers.map((ans, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                         <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">Question {idx + 1}</span>
                         <span className="text-slate-400 text-xs flex items-center"><Clock className="w-3 h-3 mr-1"/> {ans.duration}s</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">{ans.question}</h4>
                    
                    <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-600 text-sm leading-relaxed border border-slate-100">
                        <p className="font-bold text-slate-400 text-xs uppercase mb-2">Feedback</p>
                        {ans.feedback}
                    </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                    <div className="text-center">
                        <span className={`text-2xl font-extrabold ${ans.score >= 8 ? "text-green-600" : ans.score >= 5 ? "text-yellow-600" : "text-red-600"}`}>
                            {ans.score}/10
                        </span>
                        <p className="text-xs text-slate-400 uppercase font-bold">Score</p>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center space-x-6">
            <button
                onClick={onDashboard}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center shadow-sm"
            >
                <Home className="w-5 h-5 mr-2" /> Back to Dashboard
            </button>
            <button
                onClick={onTryAgain}
                className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <RefreshCw className="w-5 h-5 mr-2" /> Start New Session
            </button>
        </div>
      </div>
    </div>
  );
};

