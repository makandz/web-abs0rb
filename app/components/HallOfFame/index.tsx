"use client";

import { useEffect, useMemo, useState } from "react";

import { HALL_OF_FAME_NAMES } from "./constants";

function shuffleNames(names: string[]) {
  const shuffledNames = [...names];

  for (let i = shuffledNames.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
  }

  return shuffledNames;
}

interface MarqueeRowProps {
  names: string[];
  speed: number; // duration in seconds
}

function MarqueeRow({ names, speed }: MarqueeRowProps) {
  const nameElements = names.map((name, index) => (
    <span key={`${name}-${index}`} className="font-body text-stone-700 text-sm">
      {name}
    </span>
  ));

  return (
    <div className="relative overflow-hidden py-3">
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />

      {/* Scrolling content - duplicated for seamless loop */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {/* First copy - wrapped with gap inside and padding-right to match gap */}
        <div className="flex gap-6 shrink-0 pr-6">{nameElements}</div>
        {/* Second copy for seamless loop */}
        <div className="flex gap-6 shrink-0 pr-6">{nameElements}</div>
      </div>

      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />
    </div>
  );
}

export default function HallOfFame() {
  const [randomizedNames, setRandomizedNames] = useState(HALL_OF_FAME_NAMES);

  useEffect(() => {
    // Shuffle client-side so static rendering (and any caching) uses the deterministic order
    // while the browser sees a fresh permutation on each load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomizedNames(shuffleNames(HALL_OF_FAME_NAMES));
  }, []);

  const [row1, row2, row3, row4] = useMemo(() => {
    const chunkSize = Math.ceil(randomizedNames.length / 4);

    return [
      randomizedNames.slice(0, chunkSize),
      randomizedNames.slice(chunkSize, chunkSize * 2),
      randomizedNames.slice(chunkSize * 2, chunkSize * 3),
      randomizedNames.slice(chunkSize * 3),
    ];
  }, [randomizedNames]);

  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
        Hall of Fame
      </h2>
      <p className="font-body text-stone-700 mb-4">
        Honoring those who stayed with us on the Discord until the end.
      </p>

      <div className="overflow-hidden">
        <MarqueeRow names={row1} speed={48} />
        <MarqueeRow names={row2} speed={38} />
        <MarqueeRow names={row3} speed={48} />
        <MarqueeRow names={row4} speed={38} />
      </div>
    </section>
  );
}
