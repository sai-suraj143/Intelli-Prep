import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { db } from "../lib/db";
import {
  getPasswordStrength,
  normalizeEmail,
  validateAuthForm,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../lib/authValidation";
import { isGoogleConfigured, signInWithGoogle } from "../lib/googleAuth";

const EMPTY_FORM = { name: "", email: "", password: "", confirmPassword: "" };

function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.22 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.16 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92z"
      />
      <path
        fill="#FF3D00"
        d="M6.31 14.69l6.57 4.82C14.65 15.1 18.96 12 24 12c3.06 0 5.84 1.16 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.19-5.24C29.14 35.09 26.7 36 24 36c-5.2 0-9.62-3.32-11.28-7.95l-6.52 5.02C9.55 39.56 16.25 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.61 20.08H42V20H24v8h11.3c-.79 2.22-2.23 4.14-4.08 5.56l.01-.01 6.19 5.24C36.98 39.2 44 34 44 24c0-1.34-.14-2.65-.39-3.92z"
      />
    </svg>
  );
}

function FormField({
  id,
  label,
  icon,
  error,
  hint,
  rightElement,
  ...inputProps
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {React.createElement(icon, {
          className: "absolute left-4 top-3.5 w-5 h-5 text-slate-400",
        })}
        <input
          id={id}
          className={`w-full pl-12 ${
            rightElement ? "pr-12" : "pr-4"
          } py-3 bg-slate-50 border text-slate-900 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium ${
            error
              ? "border-red-300 bg-red-50/40 focus:ring-red-500"
              : "border-slate-200 focus:ring-black"
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          {...inputProps}
        />
        {rightElement}
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 text-xs text-red-600 flex items-center"
        >
          <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function PasswordToggle({ visible, onToggle, label }) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-700 transition-colors"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

export default function AuthScreen({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showDemoGoogle, setShowDemoGoogle] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: "Demo User",
    email: "demo.user@gmail.com",
  });
  const [demoError, setDemoError] = useState("");

  const passwordStrength = getPasswordStrength(formData.password);

  const runValidation = (field, data = formData) => {
    switch (field) {
      case "name":
        return validateName(data.name);
      case "email":
        return validateEmail(data.email);
      case "password":
        return validatePassword(data.password, { isLogin });
      case "confirmPassword":
        return validateConfirmPassword(data.confirmPassword, data.password);
      default:
        return "";
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    setFormError("");
    setFieldErrors((previous) => {
      const nextErrors = { ...previous };

      if (nextErrors[field] !== undefined) {
        nextErrors[field] = runValidation(field, nextData);
      }
      // Keep the confirm field in sync when the password changes.
      if (field === "password" && nextErrors.confirmPassword) {
        nextErrors.confirmPassword = validateConfirmPassword(
          nextData.confirmPassword,
          nextData.password
        );
      }

      return nextErrors;
    });
  };

  const handleBlur = (field) => () => {
    setFieldErrors((previous) => ({
      ...previous,
      [field]: runValidation(field),
    }));
  };

  const switchMode = () => {
    setIsLogin((previous) => !previous);
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setFormError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    const data = {
      ...formData,
      name: formData.name.trim(),
      email: normalizeEmail(formData.email),
    };
    const errors = validateAuthForm({ isLogin, ...data });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const user = db.findUser(data.email, data.password);
        if (!user) {
          setFormError("Invalid email or password. Please try again.");
          return;
        }
        onLogin(user);
        return;
      }

      const result = db.register(data.name, data.email, data.password);
      if (result.error) {
        setFormError(result.error);
        return;
      }
      onLogin(result.user);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    setFormError("");

    if (!isGoogleConfigured()) {
      setDemoError("");
      setShowDemoGoogle(true);
      return;
    }

    setGoogleLoading(true);
    try {
      const profile = await signInWithGoogle();
      const user = db.findOrCreateGoogleUser(profile);
      onLogin(user);
    } catch (error) {
      setFormError(
        error?.code === "GOOGLE_NOT_CONFIGURED"
          ? "Google sign-in is not configured for this build."
          : error?.message || "Google sign-in failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoGoogle = (event) => {
    event.preventDefault();

    const name = demoForm.name.trim();
    const email = normalizeEmail(demoForm.email);
    const validationError = validateName(name) || validateEmail(email);

    if (validationError) {
      setDemoError(validationError);
      return;
    }

    const user = db.findOrCreateGoogleUser({ name, email, picture: "" });
    setShowDemoGoogle(false);
    onLogin(user);
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

            {formError && (
              <div
                role="alert"
                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {!isLogin && (
                <FormField
                  id="name"
                  label="Full Name"
                  icon={User}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={fieldErrors.name}
                  hint="Letters, spaces, hyphens and apostrophes only."
                />
              )}

              <FormField
                id="email"
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                error={fieldErrors.email}
              />

              <div>
                <FormField
                  id="password"
                  label="Password"
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={fieldErrors.password}
                  hint={
                    isLogin
                      ? undefined
                      : "At least 8 characters, including a letter and a number."
                  }
                  rightElement={
                    <PasswordToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((previous) => !previous)}
                      label={showPassword ? "Hide password" : "Show password"}
                    />
                  }
                />

                {!isLogin && formData.password && (
                  <div className="mt-2" aria-live="polite">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((index) => (
                        <span
                          key={index}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            index < passwordStrength.score
                              ? passwordStrength.barClass
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`mt-1 text-xs font-medium ${passwordStrength.textClass}`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {!isLogin && (
                <FormField
                  id="confirmPassword"
                  label="Confirm Password"
                  icon={Lock}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  error={fieldErrors.confirmPassword}
                  rightElement={
                    <PasswordToggle
                      visible={showConfirmPassword}
                      onToggle={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    />
                  }
                />
              )}

              <button
                type="submit"
                disabled={submitting || googleLoading}
                className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center group"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-semibold">
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={googleLoading || submitting}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 font-semibold py-3.5 rounded-xl transition-all"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={switchMode}
                className="text-black font-bold hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDemoGoogle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-google-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowDemoGoogle(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <GoogleIcon className="w-7 h-7" />
              <div>
                <h3 id="demo-google-title" className="font-bold text-slate-900">
                  Continue with Google
                </h3>
                <p className="text-xs text-slate-500">Demo mode</p>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs leading-relaxed p-3 mb-5">
              Google OAuth is not configured for this build. Set{" "}
              <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in{" "}
              <code className="font-mono">client/.env</code> to enable real Google
              sign-in. For now, continue with a local demo account.
            </div>

            <form onSubmit={handleDemoGoogle} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="demo-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="demo-name"
                  type="text"
                  value={demoForm.name}
                  onChange={(event) =>
                    setDemoForm({ ...demoForm, name: event.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="demo-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="demo-email"
                  type="email"
                  value={demoForm.email}
                  onChange={(event) =>
                    setDemoForm({ ...demoForm, email: event.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium"
                />
              </div>

              {demoError && (
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  {demoError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDemoGoogle(false)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
