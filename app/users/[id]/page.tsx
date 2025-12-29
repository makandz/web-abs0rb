import { getUserDataPath, getUserIndexInFile } from "@/app/lib/userDataPath";
import Link from "next/link";
import { notFound } from "next/navigation";

// Type definitions for user data
type Clan = {
  tag: string;
  name: string;
  rank: number;
  clan_id: number;
};

type Gamemode = {
  gamemode: string;
  games?: number;
  messages?: number;
};

type UserData = {
  user: {
    id: number;
    skin: number;
    coins: number;
    level: number;
    sales: number;
    views: number;
    status: number;
    display: string;
    sign_up: number;
    total_xp: number;
    username: string;
    reward_level: number;
    alive_seconds: number;
  };
  clans: Clan[] | null;
  skins: {
    rarest_owned: {
      count: number;
      rarity: number;
      example_names: string[];
    } | null;
    top_collections:
      | {
          count: number;
          collection: string;
        }[]
      | null;
  };
  totals: {
    days_played: number;
    items_owned: number;
    biggest_sale: number;
    cases_opened: number;
    days_chatted: number;
    games_played: number;
    trades_total: number;
    chat_messages: number;
    friends_accepted: number;
    trades_completed: number;
    market_sales_made: number;
    unique_skins_owned: number;
    coins_spent_on_market: number;
    market_purchases_made: number;
    coins_earned_from_sales: number;
  };
  activity: {
    last_ip_time: number | null;
    first_ip_time: number | null;
    last_chat_time: number | null;
    last_game_time: number | null;
    first_chat_time: number | null;
    first_game_time: number | null;
  };
  playstyle: {
    avg_fps: number;
    avg_ping: number;
    top_gamemodes_by_chat: Gamemode[] | null;
    top_gamemodes_by_games: Gamemode[] | null;
  };
  moderation: {
    times_muted: number;
    reports_filed: number;
    times_reported: number;
    bans_issued_by_user: number;
    banned_records_for_username: number;
  };
};

// Helper functions
function formatDate(timestamp: number | null): string {
  if (!timestamp) return "Unknown";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(num: number | undefined | null): string {
  if (num == null) return "0";
  return num.toLocaleString();
}

function formatDuration(seconds: number | undefined | null): string {
  if (seconds == null) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

async function getUserData(id: number): Promise<UserData | null> {
  try {
    const path = getUserDataPath(id);
    const baseUrl = process.env.VERCEL_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}${path}`, { cache: "force-cache" });

    if (!response.ok) return null;

    const users: UserData[] = await response.json();
    const index = getUserIndexInFile(id);

    return users[index] || null;
  } catch {
    return null;
  }
}

// Component for stat cards
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="font-heading text-3xl font-bold text-stone-900">
        {typeof value === "number" ? formatNumber(value) : value}
      </div>
      <div className="mt-1 font-body text-sm text-stone-600">{label}</div>
    </div>
  );
}

// Component for timeline events
function TimelineEvent({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-stone-400" />
      <div>
        <div className="font-body text-sm text-stone-600">{label}</div>
        <div className="font-heading text-base font-semibold text-stone-900">
          {date}
        </div>
      </div>
    </div>
  );
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);

  if (isNaN(id) || id < 1) {
    notFound();
  }

  const userData = await getUserData(id);

  if (!userData) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-6">
        <main className="mx-auto max-w-4xl">
          <Link
            href="/users"
            className="inline-flex items-center gap-1 font-body text-sm text-stone-500 hover:text-stone-700 mb-8"
          >
            <span>←</span> Back to Search
          </Link>

          <div className="text-center py-16">
            <h1 className="font-heading text-3xl font-extrabold text-stone-900 mb-4">
              User Not Found
            </h1>
            <p className="font-body text-stone-600 mb-6">
              We couldn&apos;t find a user with ID {id} in our archive.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const { user, clans, skins, totals, activity, playstyle, moderation } =
    userData;

  const hasModerationHistory =
    moderation.times_muted > 0 ||
    moderation.times_reported > 0 ||
    moderation.reports_filed > 0;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <main className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-body text-sm text-stone-500 hover:text-stone-700 mb-8"
        >
          <span>←</span> Back to the Archive
        </Link>
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl mb-2">
            {user.display || user.username}
          </h1>
          <p className="font-body text-lg text-stone-500 mb-1">
            @{user.username}
          </p>
          <p className="font-body text-sm text-stone-600">
            Member since {formatDate(user.sign_up)}
          </p>
        </header>
        {/* At a Glance */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Core Stats
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard value={user.coins} label="Coins" />
            <StatCard value={user.views} label="Account Views" />
            <StatCard
              value={Math.floor(user.total_xp / 1000) + 1}
              label="Level"
            />
            <StatCard value={user.total_xp} label="Total XP" />
            <StatCard value={totals.days_played} label="Days Played" />
            <StatCard value={totals.items_owned} label="Items Owned" />
          </div>
        </section>
        {/* Activity Timeline */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Activity Timeline
          </h2>
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <TimelineEvent
                label="Signed Up"
                date={formatDate(user.sign_up)}
              />
              <TimelineEvent
                label="First Game"
                date={formatDate(activity.first_game_time)}
              />
              <TimelineEvent
                label="First Chat"
                date={formatDate(activity.first_chat_time)}
              />
              <TimelineEvent
                label="Last Active"
                date={formatDate(activity.last_ip_time)}
              />
            </div>
          </div>
          <p className="mt-3 font-body text-stone-500">
            Note: Game data logging started in mid-2018, chat data logging
            started in mid-2020.
          </p>
        </section>
        {/* Gaming Stats */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Gaming Stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Performance Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Games Played
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(totals.games_played)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Time Alive
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatDuration(user.alive_seconds)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Avg FPS
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {playstyle.avg_fps.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Avg Ping
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {Math.round(playstyle.avg_ping)}ms
                  </span>
                </div>
              </div>
            </div>

            {/* Top Gamemodes Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Top Gamemodes
              </h3>
              {playstyle.top_gamemodes_by_games &&
              playstyle.top_gamemodes_by_games.length > 0 ? (
                <div className="space-y-2">
                  {playstyle.top_gamemodes_by_games
                    .slice(0, 5)
                    .map((mode, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-body text-sm text-stone-600">
                          {mode.gamemode}
                        </span>
                        <span className="font-body text-sm font-medium text-stone-900">
                          {formatNumber(mode.games || 0)} games
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="font-body text-sm text-stone-500">
                  No gamemode data available
                </p>
              )}
            </div>
          </div>
        </section>
        {/* Economy & Trading */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Community Marketplace
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Sales Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Sales
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Total Sales
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(user.sales)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Biggest Sale
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(totals.biggest_sale)}
                  </span>
                </div>
              </div>
            </div>

            {/* Market Activity Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Market Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Purchases
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(totals.market_purchases_made)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Sales Made
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(totals.market_sales_made)}
                  </span>
                </div>
              </div>
            </div>

            {/* Coin Flow Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Coin Flow
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Earned
                  </span>
                  <span className="font-body text-sm font-medium text-green-700">
                    +{formatNumber(totals.coins_earned_from_sales)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Spent
                  </span>
                  <span className="font-body text-sm font-medium text-red-700">
                    -{formatNumber(totals.coins_spent_on_market)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Social Stats */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Social Stats
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard value={totals.chat_messages} label="Chat Messages" />
            <StatCard value={totals.days_chatted} label="Days Chatted" />
            <StatCard value={totals.friends_accepted} label="Friends" />
            <StatCard value={totals.trades_total} label="Trades Started" />
            <StatCard value={totals.trades_completed} label="Trades Done" />
            <StatCard value={totals.cases_opened} label="Cases Opened" />
          </div>
        </section>
        {/* Skin Collection */}
        <section className="mb-10">
          <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
            Item Collection
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Skins Overview Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Skins Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Total Owned
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(totals.items_owned)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-stone-600">
                    Unique Skins
                  </span>
                  <span className="font-body text-sm font-medium text-stone-900">
                    {formatNumber(totals.unique_skins_owned)}
                  </span>
                </div>
                {skins.rarest_owned &&
                  skins.rarest_owned.example_names.length > 0 &&
                  (() => {
                    const rarestRarity = skins.rarest_owned.rarity;
                    const rarestNames = skins.rarest_owned.example_names;
                    const rarityName =
                      rarestRarity === 1
                        ? "Common"
                        : rarestRarity === 2
                        ? "Uncommon"
                        : rarestRarity === 3
                        ? "Rare"
                        : rarestRarity === 4
                        ? "Legendary"
                        : rarestRarity === 5
                        ? "Special"
                        : rarestRarity === 6
                        ? "Event"
                        : `Tier ${rarestRarity}`;
                    const textColor =
                      rarestRarity === 1
                        ? "text-blue-600"
                        : rarestRarity === 2
                        ? "text-purple-600"
                        : rarestRarity === 3
                        ? "text-red-600"
                        : rarestRarity === 4
                        ? "text-amber-600"
                        : rarestRarity === 5
                        ? "text-green-600"
                        : rarestRarity === 6
                        ? "text-teal-600"
                        : "text-stone-900";

                    return (
                      <div className="pt-2 border-t border-stone-100">
                        <div className="flex justify-between mb-3">
                          <span className="font-body text-sm text-stone-600">
                            Rarest Tier
                          </span>
                          <span
                            className={`font-body text-sm font-medium ${textColor}`}
                          >
                            {rarityName}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rarestNames.slice(0, 5).map((name, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full font-body text-xs font-medium bg-stone-100 text-stone-700"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </div>

            {/* Top Collections Card */}
            <div className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">
                Top Collections
              </h3>
              {skins.top_collections && skins.top_collections.length > 0 ? (
                <div className="space-y-2">
                  {skins.top_collections
                    .slice(0, 5)
                    .map((collection, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-body text-sm text-stone-600">
                          {collection.collection}
                        </span>
                        <span className="font-body text-sm font-medium text-stone-900">
                          {collection.count} unique skins
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="font-body text-sm text-stone-500">
                  No collection data available
                </p>
              )}
            </div>
          </div>
        </section>
        {/* Clan Membership */}
        {clans && clans.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
              Clan Membership
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clans.map((clan) => (
                <div
                  key={clan.clan_id}
                  className="rounded-lg border border-stone-200 bg-white p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading text-sm font-bold text-stone-500">
                      [{clan.tag}]
                    </span>
                    <span className="font-heading text-lg font-bold text-stone-900">
                      {clan.name}
                    </span>
                  </div>
                  <div className="font-body text-sm text-stone-600">
                    Rank #{clan.rank}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Moderation History - only show if there's any */}
        {hasModerationHistory && (
          <section className="mb-10">
            <h2 className="font-heading text-xl font-extrabold text-stone-900 mb-3">
              Moderation
            </h2>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap gap-6">
                {moderation.times_muted > 0 && (
                  <div className="font-body text-sm text-stone-600">
                    <span className="font-medium text-stone-900">
                      {moderation.times_muted}
                    </span>{" "}
                    times muted
                  </div>
                )}
                {moderation.times_reported > 0 && (
                  <div className="font-body text-sm text-stone-600">
                    <span className="font-medium text-stone-900">
                      {moderation.times_reported}
                    </span>{" "}
                    times reported
                  </div>
                )}
                {moderation.reports_filed > 0 && (
                  <div className="font-body text-sm text-stone-600">
                    <span className="font-medium text-stone-900">
                      {moderation.reports_filed}
                    </span>{" "}
                    reports filed
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {/* Footer */}
        <footer className="border-t border-stone-200 pt-8">
          <p className="font-body text-xs tracking-widest text-stone-400 mb-4">
            end of profile
          </p>
        </footer>
      </main>
    </div>
  );
}
