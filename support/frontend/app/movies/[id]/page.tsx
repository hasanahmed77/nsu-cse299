"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Player from "../../../components/Player";
import MovieCard from "../../../components/MovieCard";
import { api } from "../../../lib/api";

export default function MovieDetail() {
  const params = useParams();
  const id = params?.id as string;

  const { data, error } = useSWR(id ? `/api/v1/movies/${id}` : null, (url) => api(url));
  const { data: recs } = useSWR(id ? `/api/v1/movies/${id}/recommendations` : null, (url) => api(url));

  if (error) return <div className="text-red-400">Failed to load movie.</div>;
  if (!data) return <div className="text-zinc-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-4">
          <Player src={data.hls_master_url || data.hlsMasterUrl} subtitles={data.subtitles || []} />
          <div className="text-zinc-400 text-xs uppercase tracking-[0.3em]">Now Playing</div>
          <h1 className="text-3xl md:text-4xl font-display tracking-wider">{data.title}</h1>
          <div className="text-zinc-400 text-sm">
            {data.year ?? "—"} • {data.duration_minutes ?? data.durationMinutes ?? "—"} min • {data.maturity_rating ?? data.maturityRating ?? "NR"}
          </div>
          <p className="text-sm text-zinc-300">{data.description}</p>
        </div>
        <div className="bg-zinc-950 border border-white/10 rounded-lg p-4 space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Details</div>
          <div className="text-sm text-zinc-300">Genres</div>
          <div className="text-xs text-zinc-500">{(data.genres || []).join(", ") || "—"}</div>
          <div className="text-sm text-zinc-300">Subtitles</div>
          <div className="text-xs text-zinc-500">
            {(data.subtitles || []).map((s: any) => s.label).join(", ") || "—"}
          </div>
        </div>
      </div>

      {recs && recs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Because You Watched</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recs.map((movie: any) => (
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
        </section>
      )}
    </div>
  );
}
