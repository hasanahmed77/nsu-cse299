import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "StreamBox",
  description: "A Netflix-style portfolio app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="px-6 py-4 flex items-center justify-between bg-panel/80 backdrop-blur">
          <Link href="/" className="text-2xl font-bold text-primary">StreamBox</Link>
          <nav className="flex gap-4 text-sm text-muted">
            <Link href="/search">Search</Link>
            <Link href="/history">History</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>
        <main className="px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
