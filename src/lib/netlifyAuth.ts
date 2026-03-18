import GoTrue from "gotrue-js";

// GoTrue endpoint — relative URL works everywhere Netlify Identity is enabled.
// Override with VITE_NETLIFY_IDENTITY_URL env var for local netlify dev or custom domains.
const API_URL =
  import.meta.env.VITE_NETLIFY_IDENTITY_URL ??
  (typeof window !== "undefined"
    ? `${window.location.origin}/.netlify/identity`
    : "https://localhost/.netlify/identity");

export const goTrue = new GoTrue({
  APIUrl: API_URL,
  setCookie: false,
});
