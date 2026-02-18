import "./globals.css";
import Link from "next/link";
import { Bebas_Neue, DM_Sans } from "next/font/google";

const display = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });

export const metadata = {
  title: "TV",
  description: "A cinematic Apple TV-inspired portfolio app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-black text-white">
        <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-3xl tracking-[0.2em] text-white font-display">
              TV
            </Link>
            <nav className="flex items-center gap-6 text-sm text-zinc-300">
              <Link className="hover:text-white" href="/search">Search</Link>
              <Link className="hover:text-white" href="/history">History</Link>
              <Link className="hover:text-white" href="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
