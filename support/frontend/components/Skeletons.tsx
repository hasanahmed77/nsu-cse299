export function HomePageSkeleton() {
  return (
    <div className="space-y-8 md:space-y-10 animate-pulse">
      <section className="relative min-h-[70vh] md:min-h-[82vh] -mt-20 md:-mt-24 bg-zinc-900/60" />
      <section className="px-4 md:px-10 space-y-3">
        <div className="h-6 w-52 rounded bg-zinc-800" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[140px] sm:w-[170px] md:w-[210px] h-[210px] md:h-[315px] rounded bg-zinc-900/70" />
          ))}
        </div>
      </section>
      <section className="px-4 md:px-10 space-y-3">
        <div className="h-6 w-44 rounded bg-zinc-800" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[140px] sm:w-[170px] md:w-[210px] h-[210px] md:h-[315px] rounded bg-zinc-900/70" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function HistoryPageSkeleton() {
  return (
    <div className="bg-zinc-950 border border-white/10 p-6 rounded-lg animate-pulse">
      <div className="h-9 w-56 rounded bg-zinc-800" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-4 space-y-3">
            <div className="h-5 w-4/5 rounded bg-zinc-800" />
            <div className="h-4 w-24 rounded bg-zinc-800" />
            <div className="h-4 w-32 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] rounded bg-zinc-900/70" />
      ))}
    </div>
  );
}

export function PlayerPageSkeleton() {
  return (
    <div className="space-y-8 md:space-y-10 animate-pulse">
      <section className="-mt-20 md:-mt-24 h-[100dvh] bg-zinc-900/70" />
      <section className="px-4 md:px-10 space-y-4">
        <div className="h-7 w-52 rounded bg-zinc-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded bg-zinc-900/70" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function MoreInfoPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <section className="relative min-h-[60vh] -mt-20 md:-mt-24 bg-zinc-900/70" />
      <section className="px-4 md:px-10 py-8 grid md:grid-cols-[220px,1fr] gap-6">
        <div className="aspect-[2/3] rounded bg-zinc-900/70" />
        <div className="space-y-4">
          <div className="h-5 w-32 rounded bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-800" />
          <div className="h-5 w-36 rounded bg-zinc-800 mt-4" />
          <div className="h-4 w-3/4 rounded bg-zinc-800" />
        </div>
      </section>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-[calc(100dvh-96px)] px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 p-6 rounded-lg animate-pulse space-y-4">
        <div className="h-9 w-44 rounded bg-zinc-800" />
        <div className="h-12 w-full rounded bg-zinc-800" />
        <div className="h-12 w-full rounded bg-zinc-800" />
        <div className="h-11 w-full rounded bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-800 mt-2" />
      </div>
    </div>
  );
}

export function GenericPageSkeleton() {
  return (
    <div className="px-4 md:px-10 py-28 animate-pulse space-y-4">
      <div className="h-10 w-56 rounded bg-zinc-800" />
      <div className="h-4 w-80 rounded bg-zinc-800" />
      <div className="h-10 w-32 rounded bg-zinc-800 mt-3" />
    </div>
  );
}
