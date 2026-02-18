import MovieCard from "./MovieCard";

type RowProps = {
  title: string;
  movies: any[];
};

export default function Row({ title, movies }: RowProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-wide">{title}</h2>
      </div>
      <div className="rounded-2xl glass-panel shadow-[0_0_60px_rgba(255,255,255,0.05)]">
        <div className="flex gap-4 overflow-x-auto px-4 py-4 snap-x snap-mandatory">
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start w-[160px] md:w-[200px]">
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterUrl={movie.poster_url || movie.posterUrl}
                year={movie.year}
                maturityRating={movie.maturity_rating || movie.maturityRating}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
