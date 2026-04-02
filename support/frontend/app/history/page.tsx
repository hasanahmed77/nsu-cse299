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

  if (error) {
    return (
      <div className="status-panel">
        <h1 className="status-title">History is unavailable</h1>
        <p className="status-copy">We could not load your watch history right now. Try refreshing in a moment.</p>
      </div>
    );
  }
  if (!data) return <HistoryPageSkeleton />;

  return (
    <div className="surface-panel p-6">
      <h1 className="text-3xl font-display tracking-wider">Watch History</h1>
      {data.length === 0 ? (
        <div className="status-panel mt-5">
          <h2 className="status-title">No watch history yet</h2>
          <p className="status-copy">Start any movie for at least 20 seconds and it will appear here.</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <article
              key={item.movie_id}
              className="rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col gap-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-zinc-100 text-base font-medium leading-snug">
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
                className="text-sm text-zinc-300 hover:text-white focus-visible:text-white"
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
