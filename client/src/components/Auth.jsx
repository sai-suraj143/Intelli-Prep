import React, { useState } from "react";
import { Mail, Lock, User, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative font-sans text-slate-900">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-slate-500 hover:text-black flex items-center transition-colors font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Brand/Visual */}
        <div className="bg-black p-12 flex flex-col justify-between md:w-5/12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-[80px] -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 rounded-full blur-[80px] -ml-16 -mb-16 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <span className="text-xl font-bold tracking-tight">Intelli-Prep</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
              {isLogin ? "Welcome back." : "Start your journey."}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isLogin 
                ? "Continue perfecting your technical interview skills with real-time AI feedback." 
                : "Join thousands of developers mastering their interview preparation."}
            </p>
          </div>
          
          <div className="relative z-10 text-xs text-slate-500">
            © 2025 Intelli-Prep Inc.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 md:w-7/12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold mb-8 text-black">
              {isLogin ? "Sign in to your account" : "Create an account"}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium"
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium"
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
                className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center group"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-black font-bold hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
