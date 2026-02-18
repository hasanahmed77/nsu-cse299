"use client";

import useSWR from "swr";
import { api } from "../../lib/api";

export default function HistoryPage() {
  const { data, error } = useSWR("/api/v1/history", (url) => api(url));

  if (error) return <div className="text-red-400">Failed to load history.</div>;

  return (
    <div className="bg-panel p-6 rounded-lg">
      <h1 className="text-2xl font-bold">Watch History</h1>
      {!data ? (
        <div className="text-muted mt-4">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-muted mt-4">No history yet.</div>
      ) : (
        <ul className="mt-4 space-y-2 text-sm">
          {data.map((item: any) => (
            <li key={item.movie_id} className="flex justify-between">
              <span>Movie #{item.movie_id}</span>
              <span className="text-muted">{Math.floor(item.progress_seconds / 60)} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
