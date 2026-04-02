import MovieCard from "./MovieCard";

type RowProps = {
  title: string;
  movies: any[];
  showRank?: boolean;
};

export default function Row({ title, movies, showRank = false }: RowProps) {
  return (
    <section className="space-y-3.5 px-4 md:px-10">
      <div className="flex items-center justify-between">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="relative">
        <div className="row-scroller flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:gap-4">
          {movies.map((movie, index) => (
            <div key={movie.id} className="w-[140px] shrink-0 snap-start sm:w-[170px] md:w-[210px]">
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
