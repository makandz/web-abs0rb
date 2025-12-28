import FeaturedCreators from "./components/FeaturedCreators";
import HallOfFame from "./components/HallOfFame";
import LeaderboardSection from "./components/LeaderboardSection";

export default async function Home() {
  const stats = [
    { value: "10", label: "Years Active" },
    { value: "171,723", label: "Registered Users" },
    { value: "28.9M", label: "Games Played" },
    { value: "1.1M", label: "Hours Played" },
    { value: "3.4M", label: "Items Owned" },
    { value: "26M", label: "Chat Messages Sent" },
  ];

  const userHighlights = [
    {
      username: "jaesun",
      title: "Chatterbox 4000",
      stat: "240,616",
      description: "chat messages sent",
    },
    {
      username: "rodrigo",
      title: "The OG",
      stat: "Sept 6, 2016",
      description: "oldest account active in 2025",
    },
    {
      username: "ecua",
      title: "Salesman of the Year",
      stat: "185,040",
      description: "sales made",
    },
    {
      username: "zcobracking",
      title: "Coin Hoarder",
      stat: "1.59M",
      description: "coins held till the end",
    },
    {
      username: "thebeast24",
      title: "⭐",
      stat: "573",
      description: "unique items owned",
    },
    {
      username: "diego5111",
      title: "Kept the mods busy",
      stat: "113",
      description: "times muted and reported",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <main className="mx-auto max-w-4xl">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-stone-900 sm:text-6xl mb-6">
            Abs0rb.me
          </h1>

          <div className="space-y-3 font-body text-lg leading-relaxed text-stone-700">
            <p>
              Abs0rb.me ran as an online multiplayer game for nearly a decade.
              This page preserves a snapshot of what it was and what happened
              during its lifetime.
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
              COMING SOON
            </span>
            <span className="font-body text-sm text-blue-900">
              User lookup coming soon, a way to search for your own stats!
            </span>
          </div>
        </header>

        {/* Core Stats Section */}
        <section>
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            At a Glance
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-lg border border-stone-200 bg-white p-4`}
              >
                <div className="font-heading text-4xl font-bold text-stone-900">
                  {stat.value}
                </div>
                <div className="mt-2 font-body text-sm text-stone-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Highlights Section */}
        <section className="mt-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Top of the Charts
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
            {userHighlights.map((user, index) => (
              <div
                key={index}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-heading text-lg font-bold text-stone-900">
                    {user.username}
                  </span>
                  <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {user.title}
                  </span>
                </div>
                <div className="font-heading text-3xl font-bold text-stone-900">
                  {user.stat}
                </div>
                <div className="mt-1 font-body text-sm text-stone-600">
                  {user.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboards Section */}
        <LeaderboardSection />

        {/* Hall of Fame Section */}
        <HallOfFame />

        {/* Featured Creators Section */}
        <FeaturedCreators />

        {/* End of Archive */}
        <footer className="mt-10 border-t border-stone-200 pt-8">
          <div className="max-w-2xl space-y-4">
            <p className="font-body text-xs tracking-widest text-stone-400">
              end of archive
            </p>

            <p className="font-body text-sm leading-relaxed text-stone-600">
              Thanks for playing, for the memories, for the chaos in chat, for
              the trades, and for sticking around all these years. And if you’re
              here today, I’m glad you made it.
            </p>

            <a
              href="https://discord.gg/7DYTZdm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Abs0rb Discord invite in a new tab"
              className="inline-flex items-center gap-1 font-body text-sm text-stone-500 hover:text-stone-700 hover:underline underline-offset-4 transition-colors"
            >
              some of us are still here <span aria-hidden>↗</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
