import { API_BASE } from "./api";

export type AuthUser = {
  id: number;
  email: string;
  full_name?: string | null;
};

let authCache: AuthUser | null | undefined = undefined;
let inFlight: Promise<AuthUser | null> | null = null;

export async function getCurrentUser(force = false): Promise<AuthUser | null> {
  if (!force && authCache !== undefined) return authCache;
  if (!force && inFlight) return inFlight;

  inFlight = fetch(`${API_BASE}/api/v1/auth/me`, {
    credentials: "include",
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
