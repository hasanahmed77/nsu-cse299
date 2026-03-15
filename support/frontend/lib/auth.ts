import { API_BASE } from "./api";

export type AuthUser = {
  id: number;
  email: string;
  full_name?: string | null;
};

let authCache: AuthUser | null | undefined = undefined;
let inFlight: Promise<AuthUser | null> | null = null;

function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setFrontendAccessToken(token: string) {
  if (typeof document === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  const secure = isSecure ? "; Secure" : "";
  document.cookie = `access_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
}

export function clearFrontendAccessToken() {
  if (typeof document === "undefined") return;
  document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
}

export async function getCurrentUser(force = false): Promise<AuthUser | null> {
  if (!force && authCache !== undefined) return authCache;
  if (!force && inFlight) return inFlight;

  const token = getAccessTokenFromCookie();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  inFlight = fetch(`${API_BASE}/api/v1/auth/me`, {
    credentials: "include",
    headers,
  })
    .then(async (res) => {
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to load auth state");
      return (await res.json()) as AuthUser;
    })
    .catch(() => null)
    .then((user) => {
      authCache = user;
      return user;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function invalidateAuthCache() {
  authCache = undefined;
  inFlight = null;
}
