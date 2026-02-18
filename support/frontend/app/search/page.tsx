"use client";

import { useState } from "react";
import useSWR from "swr";
import MovieCard from "../../components/MovieCard";
import { api } from "../../lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data, error } = useSWR(query ? `/api/v1/movies?query=${encodeURIComponent(query)}` : null, (url) => api(url));

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-white/10 p-4 rounded-lg">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30"
        />
      </div>

      {error && <div className="text-red-400">Failed to search.</div>}
      {!query && <div className="text-zinc-500">Type to search.</div>}

      {data && (
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
    </div>
  );
}
