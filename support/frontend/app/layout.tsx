import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import RouteGuard from "../components/RouteGuard";
import { Suspense } from "react";

export const metadata = {
  title: "TV",
  description: "A cinematic Apple TV-inspired portfolio app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Suspense fallback={<div className="h-[72px]" />}>
          <SiteHeader />
        </Suspense>
        <Suspense fallback={<div className="px-4 md:px-10 py-8" />}>
          <RouteGuard>
            <main className="w-full pb-10">{children}</main>
          </RouteGuard>
        </Suspense>
      </body>
    </html>
  );
}
