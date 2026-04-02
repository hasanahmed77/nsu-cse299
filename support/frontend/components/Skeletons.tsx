export function HomePageSkeleton() {
  return (
    <div className="space-y-8 md:space-y-10">
      <section className="skeleton-shimmer relative min-h-[70vh] md:min-h-[82vh] -mt-20 md:-mt-24 rounded-none bg-zinc-900/60" />
      <section className="px-4 md:px-10 space-y-3">
        <div className="skeleton-shimmer h-6 w-52 rounded-full" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-[210px] w-[140px] rounded-xl sm:w-[170px] md:h-[315px] md:w-[210px]" />
          ))}
        </div>
      </section>
      <section className="px-4 md:px-10 space-y-3">
        <div className="skeleton-shimmer h-6 w-44 rounded-full" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-[210px] w-[140px] rounded-xl sm:w-[170px] md:h-[315px] md:w-[210px]" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function HistoryPageSkeleton() {
  return (
    <div className="surface-panel p-6">
      <div className="skeleton-shimmer h-9 w-56 rounded-full" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
            <div className="skeleton-shimmer h-5 w-4/5 rounded-full" />
            <div className="skeleton-shimmer h-4 w-24 rounded-full" />
            <div className="skeleton-shimmer h-4 w-32 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton-shimmer aspect-[2/3] rounded-xl" />
      ))}
    </div>
  );
}

export function PlayerPageSkeleton() {
  return (
    <div className="space-y-8 md:space-y-10">
      <section className="skeleton-shimmer -mt-20 md:-mt-24 h-[100dvh] bg-zinc-900/70" />
      <section className="px-4 md:px-10 space-y-4">
        <div className="skeleton-shimmer h-7 w-52 rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer aspect-[2/3] rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function MoreInfoPageSkeleton() {
  return (
    <div className="min-h-screen">
      <section className="skeleton-shimmer relative min-h-[60vh] -mt-20 md:-mt-24 bg-zinc-900/70" />
      <section className="px-4 md:px-10 py-8 grid md:grid-cols-[220px,1fr] gap-6">
        <div className="skeleton-shimmer aspect-[2/3] rounded-xl" />
        <div className="space-y-4">
          <div className="skeleton-shimmer h-5 w-32 rounded-full" />
          <div className="skeleton-shimmer h-4 w-full rounded-full" />
          <div className="skeleton-shimmer h-4 w-5/6 rounded-full" />
          <div className="skeleton-shimmer mt-4 h-5 w-36 rounded-full" />
          <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
        </div>
      </section>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-[calc(100dvh-96px)] px-4 flex items-center justify-center">
      <div className="surface-panel w-full max-w-md p-6 space-y-4">
        <div className="skeleton-shimmer h-9 w-44 rounded-full" />
        <div className="skeleton-shimmer h-12 w-full rounded-xl" />
        <div className="skeleton-shimmer h-12 w-full rounded-xl" />
        <div className="skeleton-shimmer h-11 w-full rounded-xl" />
        <div className="skeleton-shimmer mt-2 h-4 w-2/3 rounded-full" />
      </div>
    </div>
  );
}

export function GenericPageSkeleton() {
  return (
    <div className="px-4 md:px-10 py-28 space-y-4">
      <div className="skeleton-shimmer h-10 w-56 rounded-full" />
      <div className="skeleton-shimmer h-4 w-80 rounded-full" />
      <div className="skeleton-shimmer mt-3 h-10 w-32 rounded-xl" />
    </div>
  );
}
