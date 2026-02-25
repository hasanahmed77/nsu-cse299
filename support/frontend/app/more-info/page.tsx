import Link from "next/link";

export default function MoreInfoIndexPage() {
  return (
    <div className="px-4 md:px-10 py-28">
      <h1 className="text-3xl md:text-4xl font-display tracking-wide">More Info</h1>
      <p className="mt-3 text-zinc-400">Select a movie from home or player to view detailed information.</p>
      <Link href="/" className="inline-block mt-6 bg-white text-black px-5 py-2 rounded-md font-semibold">
        Back Home
      </Link>
    </div>
  );
}
