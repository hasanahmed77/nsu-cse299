"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Row from "../components/Row";
import HeroPreview from "../components/HeroPreview";
import MovieCard from "../components/MovieCard";
import { HomePageSkeleton, SearchResultsSkeleton } from "../components/Skeletons";
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

type HistoryItem = {
  movie_id: number;
  movie_title?: string | null;
  progress_seconds: number;
  completed: boolean;
};

const fetcher: (url: string) => Promise<Movie[]> = (url) => api<Movie[]>(url);

export default function Home() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const { data: searchResults, error: searchError } = useSWR<Movie[]>(
    query ? `/api/v1/movies?query=${encodeURIComponent(query)}&limit=60` : null,
    fetcher
  );

  const { data: latest, error: latestError } = useSWR<Movie[]>(
    query ? null : "/api/v1/movies/latest?limit=10",
    fetcher
  );
  const { data: trending } = useSWR<Movie[]>(query ? null : "/api/v1/movies/trending", fetcher);
  const { data: allMovies, error: allMoviesError } = useSWR<Movie[]>(
    query ? null : "/api/v1/movies?page=1&limit=500",
    fetcher
  );
  const { data: history } = useSWR<HistoryItem[] | null>(
    query ? null : "/api/v1/history",
    (url: string) => api<HistoryItem[]>(url).catch(() => null)
  );

  if (searchError) {
    return (
      <div className="px-4 py-6 md:px-10">
        <div className="status-panel">
          <h1 className="status-title">Search is unavailable</h1>
          <p className="status-copy">The catalog could not be searched right now. Refresh and try again.</p>
        </div>
      </div>
    );
  }
  if (query) {
    if (!searchResults) {
      return (
        <div className="px-4 md:px-10 py-6 space-y-4">
          <div className="skeleton-shimmer h-7 w-64 rounded-full" />
          <SearchResultsSkeleton />
        </div>
      );
    }
    return (
      <div className="px-4 md:px-10 py-6 space-y-4">
        <h1 className="section-title">Search Results for "{query}"</h1>
        <p className="meta-text">
          {searchResults.length} {searchResults.length === 1 ? "title" : "titles"} found
        </p>
        {searchResults.length === 0 ? (
          <div className="status-panel">
            <h2 className="status-title">No titles found</h2>
            <p className="status-copy">Try another spelling, a shorter keyword, or a related franchise name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {searchResults.map((movie) => (
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
        )}
      </div>
    );
  }

  if (latestError || allMoviesError) {
    return (
      <div className="px-4 py-6 md:px-10">
        <div className="status-panel">
          <h1 className="status-title">We could not load the catalog</h1>
          <p className="status-copy">The homepage data failed to load. Refresh the page and try again.</p>
        </div>
      </div>
    );
  }

  if (!latest || !trending || !allMovies) {
    return <HomePageSkeleton />;
  }

  const hero = latest[0] || trending[0];
  const excludedIds = new Set([...trending.map((m) => m.id), ...latest.map((m) => m.id)]);
  const historyByMovieId = new Map((history || []).map((item) => [item.movie_id, item]));
  const continueWatching = allMovies.filter((movie) => {
    const entry = historyByMovieId.get(movie.id);
    return Boolean(entry && !entry.completed && entry.progress_seconds > 0);
  });
  continueWatching.sort((a, b) => {
    const aProgress = historyByMovieId.get(a.id)?.progress_seconds ?? 0;
    const bProgress = historyByMovieId.get(b.id)?.progress_seconds ?? 0;
    return bProgress - aProgress;
  });
  const continueWatchingTop = continueWatching.slice(0, 10);
  continueWatchingTop.forEach((movie) => excludedIds.add(movie.id));
  const allOtherMovies = allMovies.filter((movie) => !excludedIds.has(movie.id));

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="relative overflow-hidden min-h-[70vh] md:min-h-[82vh] hero-shadow -mt-20 md:-mt-24">
        <div className="absolute inset-0">
          <HeroPreview src={hero?.hls_master_url} poster={hero?.backdrop_url} title={hero?.title || "TV"} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        </div>
        <div className="relative max-w-2xl px-4 md:px-10 pt-32 md:pt-44 pb-12 space-y-5">
          <div className="text-zinc-300 uppercase tracking-[0.28em] text-[10px] md:text-xs">Featured Today</div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display tracking-wide text-white leading-none">
            {hero?.title || "TV"}
          </h1>
          <p className="max-w-xl text-zinc-200 text-sm md:text-base leading-relaxed">
            {hero?.description ||
              "A cinematic streaming experience with personalized rows, responsive playback, and cloud-delivered media."}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={hero ? `/movies/${hero.id}` : "#"}
              className="rounded-md bg-white px-6 py-2.5 font-semibold text-black hover:scale-[1.02] hover:bg-zinc-100"
            >
              Play
            </a>
            <a
              href={hero ? `/more-info/${hero.id}` : "#"}
              className="rounded-md bg-white/20 px-6 py-2.5 text-white hover:scale-[1.02] hover:bg-white/25"
            >
              More Info
            </a>
          </div>
        </div>
      </section>

      {continueWatchingTop.length > 0 && <Row title="Continue Watching" movies={continueWatchingTop} />}
      {trending && trending.length > 0 && <Row title="Trending Now" movies={trending} showRank />}
      {latest && latest.length > 0 && <Row title="Latest Releases" movies={latest} />}
      {allOtherMovies.length > 0 && <Row title="More to Explore" movies={allOtherMovies} />}
    </div>
  );
}
