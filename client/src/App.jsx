import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/Auth";
import { DashboardHome, Sidebar, TopicBrowser } from "./components/Dashboard";
import { InterviewSession, ResultView } from "./components/Session";

// --- Database Logic (Client-Side Simulation) ---
// Moving this to a utility file would be better, but keeping here for now to ensure continuity
// or assuming it might be moved to lib in future. For now, let's keep the db object available globally
// or import it if it was moved. 
// Wait, I saw `import { db } from "../lib/db";` in Auth.jsx. 
// Let's create `src/lib/db.js` if it doesn't exist, or just use what we have.
// Checking file view, `lib` dir exists. I should probably move db logic there if not already.
// For this step, I will assume I need to keep the db logic accessible or move it.
// Actually, Auth.jsx imported it from `../lib/db`. Let's assume I should move it there.
// I'll create/overwrite lib/db.js in the next step to be safe. 
// For now, let's import it.

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
