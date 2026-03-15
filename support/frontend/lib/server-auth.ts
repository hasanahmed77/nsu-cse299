import { cookies } from "next/headers";
import { API_BASE } from "./api";

export type ServerAuthUser = {
  id: number;
  email: string;
  full_name?: string | null;
};

export async function getServerUser(): Promise<ServerAuthUser | null> {
  const cookieStore = cookies();
  let cookieHeader = "";
  let accessToken: string | null = null;
  if (typeof (cookieStore as { getAll?: () => { name: string; value: string }[] }).getAll === "function") {
    const all = (cookieStore as { getAll: () => { name: string; value: string }[] }).getAll();
    cookieHeader = all.map((c) => `${c.name}=${c.value}`).join("; ");
    accessToken = all.find((c) => c.name === "access_token")?.value ?? null;
  } else if (typeof (cookieStore as { toString?: () => string }).toString === "function") {
    cookieHeader = (cookieStore as { toString: () => string }).toString();
    const match = cookieHeader.match(/(?:^|;\s*)access_token=([^;]+)/);
    accessToken = match ? decodeURIComponent(match[1]) : null;
  }

  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: {
        cookie: cookieHeader,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    return (await res.json()) as ServerAuthUser;
  } catch {
    return null;
  }
}
