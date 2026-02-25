import MovieCard from "./MovieCard";

type RowProps = {
  title: string;
  movies: any[];
  showRank?: boolean;
};

export default function Row({ title, movies, showRank = false }: RowProps) {
  return (
    <section className="space-y-3 px-4 md:px-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-semibold tracking-wide">{title}</h2>
      </div>
      <div className="relative">
        <div className="row-scroller flex gap-2 md:gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
          {movies.map((movie, index) => (
            <div key={movie.id} className="snap-start w-[140px] sm:w-[170px] md:w-[210px] shrink-0">
            <MovieCard
              id={movie.id}
              title={movie.title}
              posterUrl={movie.poster_url}
              year={movie.year}
              maturityRating={movie.maturity_rating}
              rank={showRank ? index + 1 : undefined}
            />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
