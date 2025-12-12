import React, { useState } from "react";
import { Mail, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { db } from "../lib/db";

export default function AuthScreen({ onLogin, onBack }) {
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
      const user = db.findUser(formData.email, formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password");
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }
      const result = db.register(
        formData.name,
        formData.email,
        formData.password
      );
      if (result.error) {
        setError(result.error);
      } else {
        onLogin(result.user);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side: Brand */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-10 flex flex-col justify-between md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome <br /> <span className="text-blue-500">Back.</span>
            </h1>
            <p className="text-slate-400 mt-4">
              Login to access your personalized dashboard and continue your
              preparation journey.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
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
}
