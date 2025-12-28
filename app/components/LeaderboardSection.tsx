"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  rank: number;
  username: string;
  [key: string]: string | number;
};

const LEADERBOARDS = [
  {
    id: "hours",
    label: "Hours Played",
    filePrefix: "hours",
    valueField: "seconds",
    columnHeader: "Hours",
    formatValue: (val: number) => Math.floor(val / 3600).toLocaleString(),
    bottomText:
      "These players have dedicated countless hours to the game. True legends!",
  },
  {
    id: "days",
    label: "Days Played",
    filePrefix: "days-played",
    valueField: "days",
    columnHeader: "Days",
    formatValue: (val: number) => val.toLocaleString(),
    bottomText:
      "Playing consistently over many days shows real commitment to the community.",
  },
  {
    id: "coins",
    label: "Coins",
    filePrefix: "coins",
    valueField: "coins",
    columnHeader: "Coins",
    formatValue: (val: number) => val.toLocaleString(),
    bottomText:
      "These wealthy players have amassed fortunes through skill and dedication.",
  },
  {
    id: "items",
    label: "Items Owned",
    filePrefix: "items-owned",
    valueField: "items",
    columnHeader: "Items",
    formatValue: (val: number) => val.toLocaleString(),
    bottomText:
      'Did you know that the "debugacc" account were where all trashed skins went?',
  },
  {
    id: "views",
    label: "Account Views",
    filePrefix: "account-views",
    valueField: "views",
    columnHeader: "Views",
    formatValue: (val: number) => val.toLocaleString(),
    bottomText:
      "The most viewed accounts - these players are celebrities in the community!",
  },
  {
    id: "oldest",
    label: "OG Accounts",
    filePrefix: "oldest-loggedin-2023",
    valueField: "sign_up",
    columnHeader: "Signed Up",
    formatValue: (val: number) => new Date(val * 1000).toLocaleDateString(),
    bottomText:
      "The pioneers who were there from the beginning. True OGs of the game!",
  },
];

const SKELETON_ROWS = 10;

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr className={index % 2 === 0 ? "bg-white" : "bg-stone-50"}>
      <td className="px-4 py-2.5">
        <div className="h-4 bg-stone-200 rounded w-12 animate-pulse" />
      </td>
      <td className="px-4 py-2.5">
        <div className="h-4 bg-stone-200 rounded w-32 animate-pulse" />
      </td>
      <td className="px-4 py-2.5">
        <div className="h-4 bg-stone-200 rounded w-20 ml-auto animate-pulse" />
      </td>
    </tr>
  );
}

export default function LeaderboardSection() {
  const [selectedId, setSelectedId] = useState(LEADERBOARDS[0].id);
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selected = LEADERBOARDS.find((lb) => lb.id === selectedId)!;

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setIsLoading(true);
    setData([]);
    setSelectedId(id);
  };

  useEffect(() => {
    const startTime = Date.now();
    const minDelay = 150;

    fetch(`/data/leaderboards/${selected.filePrefix}-leaderboard.json`)
      .then((res) => res.json())
      .then((json) => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          setData(json);
          setIsLoading(false);
        }, remainingDelay);
      })
      .catch(() => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          setData([]);
          setIsLoading(false);
        }, remainingDelay);
      });
  }, [selected.filePrefix]);

  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
        Leaderboards
      </h2>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {LEADERBOARDS.map((lb) => (
          <button
            key={lb.id}
            onClick={() => handleSelect(lb.id)}
            className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
              selectedId === lb.id
                ? "bg-stone-900 text-white"
                : "border border-stone-300 text-stone-700 hover:bg-stone-100"
            }`}
          >
            {lb.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-stone-100 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left font-heading text-sm font-bold text-stone-700 w-20">
                  Rank
                </th>
                <th className="px-4 py-3 text-left font-heading text-sm font-bold text-stone-700">
                  Username
                </th>
                <th className="px-4 py-3 text-right font-heading text-sm font-bold text-stone-700 w-32">
                  {selected.columnHeader}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                    <SkeletonRow key={i} index={i} />
                  ))
                : data.map((entry, index) => {
                    const value = entry[selected.valueField] as number;
                    if (value == null) return null;
                    return (
                      <tr
                        key={entry.rank}
                        className={index % 2 === 0 ? "bg-white" : "bg-stone-50"}
                      >
                        <td className="px-4 py-2.5 font-body text-sm text-stone-600">
                          #{entry.rank}
                        </td>
                        <td className="px-4 py-2.5 font-body text-sm font-medium text-stone-900">
                          {entry.username}
                        </td>
                        <td className="px-4 py-2.5 font-body text-sm text-stone-600 text-right tabular-nums">
                          {selected.formatValue(value)}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="font-body text-stone-700 mt-2">{selected.bottomText}</p>
    </section>
  );
}
