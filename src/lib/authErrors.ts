import { AUTH_DISABLED_ERROR_CODE, supabaseConfigIssue } from "@/lib/supabaseClient"

type AuthMode = "login" | "signup"

type MessageSet = {
  authDisabled: string
  invalidCredentials: string
  emailAlreadyRegistered: string
  passwordPolicy: string
  network: string
  rateLimited: string
  invalidApiKey: string
  emailConfirmationEnabled: string
  generic: string
}

const AUTH_MESSAGES: Record<"en" | "es" | "fr", MessageSet> = {
  en: {
    authDisabled:
      "Authentication is currently unavailable on this environment. Missing Supabase configuration.",
    invalidCredentials: "Invalid email or password. Please check your credentials.",
    emailAlreadyRegistered: "Email already registered. Try signing in instead.",
    passwordPolicy:
      "Password does not meet security requirements (minimum 6 characters).",
    network:
      "Connection failed. Check your internet and try again.",
    rateLimited: "Too many attempts. Please wait a moment and try again.",
    invalidApiKey:
      "Server configuration error: invalid API key. Contact the site administrator.",
    emailConfirmationEnabled:
      "Account created but email confirmation is required. Go to Supabase Dashboard → Authentication → Settings and disable \"Enable email confirmations\", then try again.",
    generic: "We could not complete authentication. Please try again.",
  },
  es: {
    authDisabled:
      "La autenticacion no esta disponible en este entorno. Falta la configuracion de Supabase.",
    invalidCredentials: "Correo o contrasena incorrectos. Por favor verifica tus datos.",
    emailAlreadyRegistered:
      "Este correo ya esta registrado. Intenta iniciar sesion.",
    passwordPolicy:
      "La contrasena no cumple los requisitos de seguridad (minimo 6 caracteres).",
    network:
      "No pudimos conectar con el servidor. Revisa tu conexion e intentalo de nuevo.",
    rateLimited: "Demasiados intentos. Espera un momento e intentalo otra vez.",
    invalidApiKey:
      "Error de configuracion del servidor: clave de API invalida. Contacta al administrador.",
    emailConfirmationEnabled:
      "Cuenta creada pero se requiere confirmacion de correo. Ve a Supabase Dashboard → Authentication → Settings y desactiva \"Enable email confirmations\", luego intenta de nuevo.",
    generic: "No pudimos completar la autenticacion. Intentalo de nuevo.",
  },
  fr: {
    authDisabled:
      "L'authentification n'est pas disponible sur cet environnement. La configuration Supabase est manquante.",
    invalidCredentials: "E-mail ou mot de passe invalide. Verifiez vos identifiants.",
    emailAlreadyRegistered:
      "Cet e-mail est deja enregistre. Essayez de vous connecter.",
    passwordPolicy:
      "Le mot de passe ne respecte pas les exigences de securite (minimum 6 caracteres).",
    network:
      "Connexion impossible. Verifiez votre connexion internet puis reessayez.",
    rateLimited: "Trop de tentatives. Veuillez patienter puis reessayer.",
    invalidApiKey:
      "Erreur de configuration du serveur: cle API invalide. Contactez l'administrateur.",
    emailConfirmationEnabled:
      "Compte cree mais confirmation par e-mail requise. Allez dans Supabase Dashboard → Authentication → Settings et desactivez \"Enable email confirmations\", puis reessayez.",
    generic: "Impossible de terminer l'authentification. Veuillez reessayer.",
  },
}

function normalizeLocale(locale: string): "en" | "es" | "fr" {
  if (locale === "es" || locale === "fr") return locale
  return "en"
}

function extractErrorText(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    return typeof message === "string" ? message : ""
  }
  return ""
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle))
}

export function getAuthDisabledMessage(locale: string): string {
  const messages = AUTH_MESSAGES[normalizeLocale(locale)]
  if (!supabaseConfigIssue) return messages.authDisabled
  return `${messages.authDisabled} (${supabaseConfigIssue})`
}

export function mapAuthErrorToMessage(
  error: unknown,
  locale: string,
  mode: AuthMode,
): string {
  const raw = extractErrorText(error)
  const normalized = raw.toLowerCase()
  const messages = AUTH_MESSAGES[normalizeLocale(locale)]

  if (
    includesAny(normalized, [
      AUTH_DISABLED_ERROR_CODE.toLowerCase(),
      "auth not configured",
      "missing vite_supabase",
    ])
  ) {
    return getAuthDisabledMessage(locale)
  }

  if (
    includesAny(normalized, [
      "failed to fetch",
      "networkerror",
      "network request failed",
      "load failed",
      "offline",
      "fetch failed",
      "timeout",
    ])
  ) {
    return messages.network
  }

  if (
    includesAny(normalized, [
      "invalid login credentials",
      "invalid credentials",
      "invalid_grant",
      "email or password",
      "no user found",
      "grant",
    ])
  ) {
    return messages.invalidCredentials
  }

  if (
    mode === "signup" &&
    includesAny(normalized, [
      "already registered",
      "user_already_exists",
      "already exists",
      "email address already",
      "awaiting email confirmation",
    ])
  ) {
    return messages.emailAlreadyRegistered
  }

  if (
    includesAny(normalized, [
      "password should",
      "password must",
      "weak password",
      "password is too short",
      "password",
    ])
  ) {
    return messages.passwordPolicy
  }

  if (
    includesAny(normalized, [
      "invalid api key",
      "invalid_api_key",
      "apikey is invalid",
      "missing_api_key",
      "no api key",
      "invalid jwt",
      "jwt expired",
      "bad_jwt",
    ])
  ) {
    return messages.invalidApiKey
  }

  if (
    includesAny(normalized, [
      "supabase_email_confirmation_enabled",
      "email confirmation is required",
      "awaiting email confirmation",
    ])
  ) {
    return messages.emailConfirmationEnabled
  }

  if (
    includesAny(normalized, [
      "too many requests",
      "over_email_send_rate_limit",
      "rate limit",
      "429",
    ])
  ) {
    return messages.rateLimited
  }

  return raw || messages.generic
}
