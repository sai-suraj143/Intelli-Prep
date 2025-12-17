import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/Auth";
import { DashboardHome, Sidebar, TopicBrowser } from "./components/Dashboard";
import { InterviewSession, ResultView } from "./components/Session";
import { db } from "./lib/db";

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
  const handleLogin = (user) => {
    sessionStorage.setItem("intelli_user", JSON.stringify(user));
    setUser(user);
    setView("dashboard");
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
      
      // Increment questions solved count based on answers length
      updatedUser.progress[activeTopic] =
        (updatedUser.progress[activeTopic] || 0) + data.answers.length;
      
      // Update total hours based on actual duration (seconds to hours)
      // Round to 2 decimal places for display validity
      const hoursAdded = data.duration / 3600;
      updatedUser.totalHours = parseFloat(((updatedUser.totalHours || 0) + hoursAdded).toFixed(2));

      db.saveUser(updatedUser);
      sessionStorage.setItem("intelli_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // --- Router ---

  if (view === "landing") {
    return (
      <LandingPage 
        onGetStarted={() => setView("auth")} 
        onNavigate={(target) => {
          if (target === "topics") {
            // If user is not logged in, they should go to auth first, or maybe we allow viewing topics?
            // User flow: "Explore topics" -> Auth -> Topics
            if (!user) {
              setView("auth"); 
            } else {
              setView("topics");
            }
          }
        }}
      />
    );
  }

  if (view === "auth") {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onBack={() => setView("landing")}
      />
    );
  }

  return (
    <div className="font-sans bg-white min-h-screen flex">
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
