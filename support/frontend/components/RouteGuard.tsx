"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";

const PUBLIC_ROUTES = new Set(["/login", "/register"]);

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname || "");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isPublicRoute) {
      setAllowed(true);
      return;
    }

    let cancelled = false;

    const check = async () => {
      const user = await getCurrentUser();
      if (cancelled) return;

      if (!user) {
        router.replace("/login");
        setAllowed(false);
        return;
      }

      setAllowed(true);
    };

    setAllowed(false);
    void check();

    return () => {
      cancelled = true;
    };
  }, [isPublicRoute, pathname, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
