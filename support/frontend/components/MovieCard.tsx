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
      className="group block rounded overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/30 hover:scale-[1.08] transition duration-300 relative"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 shadow-[0_0_40px_rgba(0,0,0,0.8)] z-10" />
      <div className="aspect-[2/3] bg-zinc-900">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt={title} className="h-full w-full object-cover group-hover:opacity-90" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs">
            No Poster
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 p-2 bg-gradient-to-t from-black to-black/20">
        <div className="font-semibold text-xs sm:text-sm text-white line-clamp-1">{title}</div>
        <div className="text-[10px] sm:text-[11px] text-zinc-300 uppercase tracking-[0.12em]">
          {year ?? "—"} | {maturityRating ?? "NR"}
        </div>
      </div>
      {typeof rank === "number" && rank <= 10 && (
        <div className="absolute left-2 top-2 z-20 text-xs font-semibold px-2 py-0.5 rounded bg-secondary/90 text-black">
          #{rank}
        </div>
      )}
    </Link>
  );
}
