import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  posterUrl?: string | null;
  year?: number | null;
  maturityRating?: string | null;
  rank?: number;
};

export default function MovieCard({ id, title, posterUrl, year, maturityRating, rank }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${id}`}
      className="group relative block overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-[0_12px_26px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:scale-[1.035] hover:border-white/25 hover:shadow-[0_22px_40px_rgba(0,0,0,0.38)] focus-visible:-translate-y-1 focus-visible:scale-[1.02]"
    >
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 shadow-[0_0_40px_rgba(0,0,0,0.8)]" />
      <div className="aspect-[2/3] bg-zinc-900">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:opacity-90 group-focus-visible:scale-[1.03] group-focus-visible:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
            No Poster
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-black/20 px-3 py-3">
        <div className="line-clamp-1 text-sm font-semibold text-white sm:text-[0.95rem]">{title}</div>
        <div className="meta-text">
          {year ?? "—"} • {maturityRating ?? "NR"}
        </div>
      </div>
      {typeof rank === "number" && rank <= 10 && (
        <div className="absolute left-3 top-3 z-20 rounded-full bg-secondary/95 px-2.5 py-1 text-[11px] font-semibold text-black shadow-[0_8px_18px_rgba(0,0,0,0.28)]">
          #{rank}
        </div>
      )}
    </Link>
  );
}
