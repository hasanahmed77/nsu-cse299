"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Player from "../../../components/Player";
import MovieCard from "../../../components/MovieCard";
import { PlayerPageSkeleton } from "../../../components/Skeletons";
import { api } from "../../../lib/api";

type Subtitle = { label: string; language: string; url: string };
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
  subtitles?: Subtitle[];
};

export default function MovieDetail() {
  const params = useParams();
  const id = params?.id as string;

  const movieFetcher = (url: string) => api<Movie>(url);
  const recsFetcher = (url: string) => api<Movie[]>(url);
  const { data, error } = useSWR<Movie>(id ? `/api/v1/movies/${id}` : null, movieFetcher);
  const { data: recs } = useSWR<Movie[]>(
    id ? `/api/v1/movies/${id}/recommendations` : null,
    recsFetcher
  );

  if (error) return <div className="text-secondary">Failed to load movie.</div>;
  if (!data) return <PlayerPageSkeleton />;

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="-mt-20 md:-mt-24">
        <Player
          movieId={data.id}
          src={data.hls_master_url}
          subtitles={data.subtitles || []}
          movieTitle={data.title}
          description={data.description}
        />
      </section>

      {recs && recs.length > 0 && (
        <section className="space-y-4 px-4 md:px-10">
          <h2 className="text-xl font-semibold">Because You Watched</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recs.map((movie: any) => (
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
        </section>
      )}
    </div>
  );
}
