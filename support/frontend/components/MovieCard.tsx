import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  posterUrl?: string | null;
  year?: number | null;
  maturityRating?: string | null;
};

export default function MovieCard({ id, title, posterUrl, year, maturityRating }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${id}`}
      className="group block rounded-xl overflow-hidden bg-zinc-900/70 border border-white/5 hover:border-white/20 hover:scale-[1.04] hover:-translate-y-1 transition duration-300 relative"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 shadow-[0_0_60px_rgba(255,255,255,0.15)]" />
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
      <div className="p-3 space-y-1">
        <div className="font-semibold text-sm group-hover:text-white">{title}</div>
        <div className="text-[11px] text-zinc-400 uppercase tracking-[0.2em]">
          {year ?? "—"} • {maturityRating ?? "NR"}
        </div>
      </div>
    </Link>
  );
}
