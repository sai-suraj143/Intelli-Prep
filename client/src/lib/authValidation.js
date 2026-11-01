const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;
const COMMON_PASSWORDS = [
  "password",
  "password1",
  "12345678",
  "123456789",
  "qwerty123",
  "letmein1",
  "welcome1",
];

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export function validateName(value = "") {
  const name = value.trim();

  if (!name) return "Full name is required.";
  if (name.length < 2) return "Name must be at least 2 characters long.";
  if (name.length > 50) return "Name must be 50 characters or fewer.";
  if (!NAME_REGEX.test(name)) {
    return "Use letters, spaces, hyphens or apostrophes only.";
  }

  return "";
}

export function validateEmail(value = "") {
  const email = normalizeEmail(value);

  if (!email) return "Email address is required.";
  if (email.length > 254) return "Email address is too long.";
  if (email.includes("..")) return "Email address cannot contain consecutive dots.";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address, e.g. you@example.com.";

  return "";
}

export function validatePassword(value = "", { isLogin = false } = {}) {
  if (!value) return "Password is required.";

  // Keep login checks light so existing local accounts with older passwords
  // can still sign in. Strength rules apply when creating an account.
  if (isLogin) return "";

  if (value.length < 8) return "Password must be at least 8 characters long.";
  if (value.length > 64) return "Password must be 64 characters or fewer.";
  if (!/[A-Za-z]/.test(value)) return "Password must include at least one letter.";
  if (!/\d/.test(value)) return "Password must include at least one number.";
  if (/\s/.test(value)) return "Password cannot contain spaces.";
  if (COMMON_PASSWORDS.includes(value.toLowerCase())) {
    return "That password is too common. Choose a stronger one.";
  }

  return "";
}

export function validateConfirmPassword(value = "", password = "") {
  if (!value) return "Please confirm your password.";
  if (value !== password) return "Passwords do not match.";

  return "";
}

export function getPasswordStrength(password = "") {
  if (!password) {
    return { score: 0, label: "", barClass: "bg-slate-200", textClass: "text-slate-500" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Keep the meter within four visible bars.
  score = Math.min(score, 4);

  if (score <= 1) {
    return { score, label: "Weak", barClass: "bg-red-500", textClass: "text-red-600" };
  }
  if (score <= 2) {
    return { score, label: "Fair", barClass: "bg-amber-500", textClass: "text-amber-600" };
  }
  if (score === 3) {
    return { score, label: "Good", barClass: "bg-blue-500", textClass: "text-blue-600" };
  }

  return { score, label: "Strong", barClass: "bg-emerald-500", textClass: "text-emerald-600" };
}

export function validateAuthForm({ isLogin, name, email, password, confirmPassword }) {
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password, { isLogin }),
  };

  if (!isLogin) {
    errors.name = validateName(name);
    errors.confirmPassword = validateConfirmPassword(confirmPassword, password);
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
