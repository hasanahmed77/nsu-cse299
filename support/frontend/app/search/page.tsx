"use client";

import { useState } from "react";
import useSWR from "swr";
import MovieCard from "../../components/MovieCard";
import { api } from "../../lib/api";
import { SearchResultsSkeleton } from "../../components/Skeletons";

type Movie = {
  id: number;
  title: string;
  year?: number | null;
  poster_url?: string | null;
  maturity_rating?: string | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const fetcher = (url: string) => api<Movie[]>(url);
  const { data, error } = useSWR<Movie[]>(
    query ? `/api/v1/movies?query=${encodeURIComponent(query)}` : null,
    fetcher
  );

  return (
    <div className="space-y-6">
      <div className="surface-panel p-4">
        <input
          id="search-page-query"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {error ? (
        <div className="status-panel">
          <h2 className="status-title">Search failed</h2>
          <p className="status-copy">We could not load results right now. Try again in a moment.</p>
        </div>
      ) : null}
      {!query ? (
        <div className="status-panel">
          <h2 className="status-title">Search the catalog</h2>
          <p className="status-copy">Type a title, franchise, or close match to browse relevant movies instantly.</p>
        </div>
      ) : null}
      {query && !data && !error && <SearchResultsSkeleton />}

      {data && (
        data.length === 0 ? (
          <div className="status-panel">
            <h2 className="status-title">No matching titles</h2>
            <p className="status-copy">Try a shorter title, a character name, or a slightly different spelling.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="meta-text">
              {data.length} {data.length === 1 ? "title" : "titles"} found
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {data.map((movie: any) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterUrl={movie.poster_url}
                  year={movie.year}
                  maturityRating={movie.maturity_rating}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
