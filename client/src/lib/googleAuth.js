const GOOGLE_CLIENT_SCRIPT = "https://accounts.google.com/gsi/client";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

let scriptPromise = null;

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
}

export function isGoogleConfigured() {
  return Boolean(getGoogleClientId());
}

export function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser."));
  }

  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_CLIENT_SCRIPT}"]`);

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Could not load Google sign-in. Check your connection.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_CLIENT_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Could not load Google sign-in. Check your connection."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Google returned an invalid credential.");

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));

  return JSON.parse(new TextDecoder().decode(bytes));
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error("Could not read your Google profile. Please try again.");

  return response.json();
}

/**
 * Opens the Google account picker and resolves with the selected profile.
 * Requires VITE_GOOGLE_CLIENT_ID and an authorized JavaScript origin in the
 * Google Cloud console (e.g. http://localhost:5173).
 */
export async function signInWithGoogle() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    const error = new Error("Google sign-in is not configured.");
    error.code = "GOOGLE_NOT_CONFIGURED";
    throw error;
  }

  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: async (response) => {
        if (response.error) {
          finish(reject, new Error(response.error_description || "Google sign-in was cancelled."));
          return;
        }

        try {
          const profile = response.id_token
            ? decodeJwtPayload(response.id_token)
            : await fetchGoogleProfile(response.access_token);

          if (!profile?.email) {
            throw new Error("Your Google account did not share an email address.");
          }

          finish(resolve, {
            name: profile.name || profile.email.split("@")[0],
            email: profile.email,
            picture: profile.picture || "",
          });
        } catch (error) {
          finish(reject, error);
        }
      },
      error_callback: (error) => {
        const message =
          error?.type === "popup_closed"
            ? "Google sign-in was cancelled."
            : error?.message || "Google sign-in failed. Please try again.";
        finish(reject, new Error(message));
      },
    });

    client.requestAccessToken({ prompt: "select_account" });
  });
}
