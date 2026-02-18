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
      className="group bg-panel rounded-lg overflow-hidden shadow hover:shadow-xl transition"
    >
      <div className="aspect-[2/3] bg-black">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted">
            No Poster
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="font-semibold text-sm group-hover:text-primary">{title}</div>
        <div className="text-xs text-muted">{year ?? "—"} • {maturityRating ?? "NR"}</div>
      </div>
    </Link>
  );
}
