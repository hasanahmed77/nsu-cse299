import { SearchResultsSkeleton } from "../../components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-white/10 p-4 rounded-lg animate-pulse">
        <div className="h-12 rounded bg-zinc-800" />
      </div>
      <SearchResultsSkeleton />
    </div>
  );
}
