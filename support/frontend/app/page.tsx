"use client";

import useSWR from "swr";
import Row from "../components/Row";
import { api } from "../lib/api";

type Movie = {
  id: number;
  title: string;
  description: string;
  year?: number | null;
  duration_minutes?: number | null;
  maturity_rating?: string | null;
  poster_url?: string | null;
  backdrop_url?: string | null;
  hls_master_url: string;
  genres?: string[];
  subtitles?: { label: string; language: string; url: string }[];
};

const fetcher: (url: string) => Promise<Movie[]> = (url) => api<Movie[]>(url);

export default function Home() {
  const { data: latest, error } = useSWR<Movie[]>("/api/v1/movies?limit=18", fetcher);
  const { data: trending } = useSWR<Movie[]>("/api/v1/movies/trending", fetcher);

  if (error) {
    return <div className="text-red-400">Failed to load.</div>;
  }

  const hero = (latest && latest[0]) || (trending && trending[0]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl glass-panel">
        <div className="absolute inset-0">
          {hero?.backdrop_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.backdrop_url} alt={hero.title} className="h-full w-full object-cover opacity-45 hero-zoom" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-black to-black hero-zoom" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
          <div className="absolute inset-0 grain-overlay" />
        </div>
        <div className="relative p-8 md:p-12 space-y-4">
          <div className="text-zinc-400 uppercase tracking-[0.3em] text-xs">Featured</div>
          <h1 className="text-4xl md:text-6xl font-display tracking-wider text-white">
            {hero?.title || "TV"}
          </h1>
          <p className="max-w-2xl text-zinc-300 text-sm md:text-base">
            {hero?.description ||
              "An Apple TV-inspired streaming experience with clean typography and cinematic depth."}
          </p>
          <div className="flex gap-3">
            <a
              href={hero ? `/movies/${hero.id}` : "#"}
              className="bg-white text-black font-semibold px-5 py-2 rounded-full"
            >
              Play
            </a>
            <a
              href="/search"
              className="bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full"
            >
              Browse
            </a>
          </div>
        </div>
      </section>

      {trending && trending.length > 0 && <Row title="Trending Now" movies={trending} />}
      {latest && latest.length > 0 && <Row title="Latest Releases" movies={latest} />}
    </div>
  );
}
