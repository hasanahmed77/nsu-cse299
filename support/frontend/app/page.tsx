"use client";

import useSWR from "swr";
import MovieCard from "../components/MovieCard";
import { api } from "../lib/api";

const fetcher = (url: string) => api(url);

export default function Home() {
  const { data, error } = useSWR("/api/v1/movies?limit=12", fetcher);

  if (error) {
    return <div className="text-red-400">Failed to load.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="bg-panel p-6 rounded-lg">
        <h1 className="text-3xl font-bold">Welcome to StreamBox</h1>
        <p className="text-muted mt-2">A portfolio-grade Netflix clone built with Next.js and FastAPI.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Latest</h2>
        {!data ? (
          <div className="text-muted">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.map((movie: any) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.poster_url || movie.posterUrl}
                year={movie.year}
                maturityRating={movie.maturity_rating || movie.maturityRating}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
