"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { MoreInfoPageSkeleton } from "../../../components/Skeletons";
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

export default function MoreInfoPage() {
  const params = useParams();
  const id = params?.id as string;
  const fetcher = (url: string) => api<Movie>(url);
  const { data, error } = useSWR<Movie>(id ? `/api/v1/movies/${id}` : null, fetcher);

  if (error) return <div className="text-secondary px-4 md:px-10">Failed to load movie info.</div>;
  if (!data) return <MoreInfoPageSkeleton />;

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[60vh] overflow-hidden -mt-20 md:-mt-24">
        {data.backdrop_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.backdrop_url} alt={data.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35" />
        <div className="relative px-4 md:px-10 pt-32 md:pt-44 pb-10 max-w-3xl space-y-4">
          <p className="text-zinc-300 uppercase tracking-[0.3em] text-xs">More Info</p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide">{data.title}</h1>
          <p className="text-zinc-200 leading-relaxed text-sm md:text-base">{data.description}</p>
          <div className="text-zinc-300 text-sm">
            {data.year ?? "—"} • {data.duration_minutes ?? "—"} min • {data.maturity_rating ?? "NR"}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/movies/${data.id}`} className="bg-white text-black font-semibold px-6 py-2.5 rounded-md">
              Play
            </Link>
            <Link href="/" className="bg-white/20 text-white px-6 py-2.5 rounded-md">
              Back Home
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 py-8 grid md:grid-cols-[220px,1fr] gap-6">
        <div className="rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
          {data.poster_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.poster_url} alt={data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="aspect-[2/3] flex items-center justify-center text-zinc-500 text-sm">No Poster</div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-zinc-300 text-sm uppercase tracking-[0.2em]">Genres</h2>
            <p className="text-zinc-100 mt-1">{(data.genres || []).join(", ") || "—"}</p>
          </div>
          <div>
            <h2 className="text-zinc-300 text-sm uppercase tracking-[0.2em]">Subtitles</h2>
            <p className="text-zinc-100 mt-1">{(data.subtitles || []).map((s) => s.label).join(", ") || "None"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
