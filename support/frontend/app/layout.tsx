import "./globals.css";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import RouteGuard from "../components/RouteGuard";

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
        <SiteHeader />
        <RouteGuard>
          <main className="w-full pb-10">{children}</main>
        </RouteGuard>
      </body>
    </html>
  );
}
