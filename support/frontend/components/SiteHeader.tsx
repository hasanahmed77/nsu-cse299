"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AuthNav from "./AuthNav";
import { getCurrentUser } from "../lib/auth";

type PlayerChromeEvent = CustomEvent<{ visible: boolean }>;

type HeaderUser = {
  id: number;
  email: string;
  full_name?: string | null;
};

export default function SiteHeader({ initialUser }: { initialUser?: HeaderUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onPlayerPage = pathname?.startsWith("/movies/") ?? false;
  const onAuthPage = pathname === "/login" || pathname === "/register";
  const showSearch = !onPlayerPage && !onAuthPage;
  const [playerChromeVisible, setPlayerChromeVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initialAuth = useRef<boolean | null>(
    initialUser === undefined ? null : Boolean(initialUser)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuth.current === null ? false : initialAuth.current
  );
  const currentQuery = useMemo(() => (searchParams.get("q") || "").trim(), [searchParams]);
  const [searchValue, setSearchValue] = useState(currentQuery);

  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const onChromeChange = (event: Event) => {
      const custom = event as PlayerChromeEvent;
      setPlayerChromeVisible(Boolean(custom.detail?.visible));
    };

    window.addEventListener("player-chrome-visibility", onChromeChange as EventListener);
    return () => window.removeEventListener("player-chrome-visibility", onChromeChange as EventListener);
  }, []);

  useEffect(() => {
    if (!onPlayerPage) {
      setPlayerChromeVisible(true);
    }
  }, [onPlayerPage]);

  useEffect(() => {
    if (initialUser !== undefined) return;
    let cancelled = false;
    getCurrentUser().then((u) => {
      if (!cancelled) setIsAuthenticated(Boolean(u));
    });
    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  useEffect(() => {
    let cancelled = false;
    const onAuthChanged = () => {
      getCurrentUser(true).then((u) => {
        if (!cancelled) setIsAuthenticated(Boolean(u));
      });
    };
    window.addEventListener("auth-state-changed", onAuthChanged);
    return () => {
      cancelled = true;
      window.removeEventListener("auth-state-changed", onAuthChanged);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const shouldHide = onPlayerPage && !playerChromeVisible;

  useEffect(() => {
    const nextQuery = searchValue.trim();
    const timer = setTimeout(() => {
      if (pathname !== "/") {
        if (nextQuery.length > 0) {
          router.push(`/?q=${encodeURIComponent(nextQuery)}`);
        }
        return;
      }

      if (nextQuery === currentQuery) return;
      const params = new URLSearchParams(searchParams.toString());
      if (nextQuery.length > 0) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }
      const nextUrl = params.toString() ? `/?${params.toString()}` : "/";
      router.replace(nextUrl, { scroll: false });
    }, 180);

    return () => clearTimeout(timer);
  }, [searchValue, pathname, currentQuery, searchParams, router]);

  return (
    <header
      className={`sticky top-0 z-50 netflix-header transition-opacity duration-300 ${
        shouldHide ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full px-4 md:px-10 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 text-3xl md:text-4xl netflix-logo font-display leading-none"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 md:w-8 md:h-8"
            aria-hidden="true"
          >
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 3L12 6L15 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>TV</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          {showSearch ? (
            <div className="relative hidden md:block">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                id="desktop-nav-search"
                name="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search titles..."
                className="w-[150px] sm:w-[190px] md:w-[260px] bg-black/50 border border-white/20 rounded-md pl-9 pr-8 py-2 text-xs md:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
              {searchValue ? (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-sm"
                  aria-label="Clear search"
                >
                  x
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="hidden md:block">
            <AuthNav initialUser={initialUser ?? null} />
          </div>
          <button
            type="button"
            className="md:hidden p-2 rounded-md border border-white/30"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              {mobileMenuOpen ? (
                <>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen ? (
        <div className="md:hidden px-4 pb-4">
          <div className="rounded-lg border border-white/15 bg-black/80 backdrop-blur-sm p-3 space-y-3">
            {showSearch ? (
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  id="mobile-nav-search"
                  name="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search titles..."
                  className="w-full bg-black/50 border border-white/20 rounded-md pl-9 pr-8 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                />
                {searchValue ? (
                  <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-sm"
                    aria-label="Clear search"
                  >
                    x
                  </button>
                ) : null}
              </div>
            ) : null}
            <AuthNav mobile onNavigate={() => setMobileMenuOpen(false)} initialUser={initialUser ?? null} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
