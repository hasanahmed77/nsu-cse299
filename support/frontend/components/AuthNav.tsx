"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE } from "../lib/api";
import { useEffect, useRef, useState } from "react";
import { clearFrontendAccessToken, getCurrentUser, invalidateAuthCache } from "../lib/auth";

type User = {
  id: number;
  email: string;
  full_name?: string | null;
};

type AuthNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  initialUser?: User | null;
};

let authUserCache: User | null | undefined = undefined;
let authUserRequest: Promise<User | null> | null = null;

export default function AuthNav({ mobile = false, onNavigate, initialUser }: AuthNavProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser ?? authUserCache ?? null);
  const seededRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const syncAuth = async () => {
      if (!seededRef.current && initialUser !== undefined) {
        authUserCache = initialUser;
        seededRef.current = true;
      }
      if (!authUserRequest) {
        authUserRequest = getCurrentUser();
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
    clearFrontendAccessToken();
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
        className={`hover:text-white focus-visible:text-white ${mobile ? "rounded-xl border border-white/10 px-3 py-2" : "hidden sm:inline"}`}
        href="/"
        onClick={onNavigate}
      >
        Home
      </Link>
      {user ? (
        <>
          <Link
            className={`hover:text-white focus-visible:text-white ${mobile ? "rounded-xl border border-white/10 px-3 py-2" : ""}`}
            href="/history"
            onClick={onNavigate}
          >
            History
          </Link>
          <button
            className={`border border-white/70 px-3 py-1.5 font-medium text-white hover:-translate-y-0.5 hover:border-white hover:bg-white/5 ${mobile ? "rounded-xl text-left" : "rounded-full"}`}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            className={`border border-white/70 px-3 py-1.5 font-medium text-white hover:-translate-y-0.5 hover:border-white hover:bg-white/5 ${mobile ? "rounded-xl" : "rounded-full"}`}
            href="/login"
            onClick={onNavigate}
          >
            Login
          </Link>
          <Link
            className={`border border-white/70 bg-white/10 px-3 py-1.5 font-medium text-white hover:-translate-y-0.5 hover:border-white hover:bg-white/15 ${mobile ? "rounded-xl" : "rounded-full"}`}
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
