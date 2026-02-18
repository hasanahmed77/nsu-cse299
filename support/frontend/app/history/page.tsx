"use client";

import useSWR from "swr";
import { api } from "../../lib/api";

export default function HistoryPage() {
  const { data, error } = useSWR("/api/v1/history", (url) => api(url));

  if (error) return <div className="text-red-400">Failed to load history.</div>;

  return (
    <div className="bg-zinc-950 border border-white/10 p-6 rounded-lg">
      <h1 className="text-3xl font-display tracking-wider">Watch History</h1>
      {!data ? (
        <div className="text-zinc-500 mt-4">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-zinc-500 mt-4">No history yet.</div>
      ) : (
        <ul className="mt-4 space-y-2 text-sm">
          {data.map((item: any) => (
            <li key={item.movie_id} className="flex justify-between border-b border-white/5 py-2">
              <span className="text-zinc-300">Movie #{item.movie_id}</span>
              <span className="text-zinc-500">{Math.floor(item.progress_seconds / 60)} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
