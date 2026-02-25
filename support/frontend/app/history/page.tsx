"use client";

import useSWR from "swr";
import { api } from "../../lib/api";
import { HistoryPageSkeleton } from "../../components/Skeletons";

type HistoryItem = {
  movie_id: number;
  movie_title?: string | null;
  progress_seconds: number;
  completed: boolean;
};

export default function HistoryPage() {
  const fetcher = (url: string) => api<HistoryItem[]>(url);
  const { data, error } = useSWR<HistoryItem[]>("/api/v1/history", fetcher);

  if (error) return <div className="text-secondary">Failed to load history.</div>;
  if (!data) return <HistoryPageSkeleton />;

  return (
    <div className="bg-zinc-950 border border-white/10 p-6 rounded-lg">
      <h1 className="text-3xl font-display tracking-wider">Watch History</h1>
      {data.length === 0 ? (
        <div className="text-zinc-500 mt-4">No history yet.</div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <article
              key={item.movie_id}
              className="rounded-lg border border-white/10 bg-black/30 p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-zinc-100 font-medium leading-snug">
                  {item.movie_title || `Movie #${item.movie_id}`}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    item.completed
                      ? "text-emerald-300 border-emerald-400/40 bg-emerald-500/10"
                      : "text-amber-300 border-amber-400/40 bg-amber-500/10"
                  }`}
                >
                  {item.completed ? "Completed" : "In Progress"}
                </span>
              </div>
              <a
                href={`/movies/${item.movie_id}`}
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                {item.completed ? "Watch Again" : "Continue Watching"}
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
