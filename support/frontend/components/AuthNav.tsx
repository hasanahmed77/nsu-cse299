"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE } from "../lib/api";
import { useEffect, useState } from "react";
import { invalidateAuthCache } from "../lib/auth";

type User = {
  id: number;
  email: string;
  full_name?: string | null;
};

type AuthNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

let authUserCache: User | null | undefined = undefined;
let authUserRequest: Promise<User | null> | null = null;

async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    credentials: "include",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load auth state");
  return res.json();
}

export default function AuthNav({ mobile = false, onNavigate }: AuthNavProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(authUserCache ?? null);
  const [loading, setLoading] = useState(authUserCache === undefined);

  useEffect(() => {
    let cancelled = false;
    const syncAuth = async () => {
      if (!authUserRequest) {
        authUserRequest = fetchCurrentUser();
      }

      authUserRequest
        .then((u) => {
          authUserCache = u;
          if (!cancelled) setUser(u);
        })
        .catch(() => {
          authUserCache = null;
          if (!cancelled) setUser(null);
        })
        .finally(() => {
          authUserRequest = null;
          if (!cancelled) setLoading(false);
        });
    };

    void syncAuth();

    const onAuthChanged = () => {
      authUserRequest = null;
      authUserCache = undefined;
      void syncAuth();
    };
    window.addEventListener("auth-state-changed", onAuthChanged);

    return () => {
      cancelled = true;
      window.removeEventListener("auth-state-changed", onAuthChanged);
    };
  }, []);

  async function handleLogout() {
    await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    authUserCache = null;
    authUserRequest = null;
    invalidateAuthCache();
    setUser(null);
    window.dispatchEvent(new Event("auth-state-changed"));
    router.push("/login");
    router.refresh();
    onNavigate?.();
  }

  return (
    <nav
      className={`text-zinc-300 ${mobile ? "flex flex-col items-stretch gap-2 text-sm" : "flex items-center gap-3 md:gap-6 text-xs md:text-sm"}`}
    >
      <Link
        className={`hover:text-white ${mobile ? "px-3 py-2 rounded-md border border-white/10" : "hidden sm:inline"}`}
        href="/"
        onClick={onNavigate}
      >
        Home
      </Link>
      {loading ? (
        <span className={`text-zinc-500 ${mobile ? "px-3 py-2" : ""}`}>Auth...</span>
      ) : user ? (
        <>
          <Link
            className={`hover:text-white ${mobile ? "px-3 py-2 rounded-md border border-white/10" : ""}`}
            href="/history"
            onClick={onNavigate}
          >
            History
          </Link>
          <button
            className={`border border-white/70 text-white hover:border-white px-3 py-1.5 font-medium ${mobile ? "rounded-md text-left" : "rounded-full"}`}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            className={`border border-white/70 hover:border-white text-white px-3 py-1.5 font-medium ${mobile ? "rounded-md" : "rounded-full"}`}
            href="/login"
            onClick={onNavigate}
          >
            Login
          </Link>
          <Link
            className={`border border-white/70 hover:border-white text-white px-3 py-1.5 font-medium bg-white/10 ${mobile ? "rounded-md" : "rounded-full"}`}
            href="/register"
            onClick={onNavigate}
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}
