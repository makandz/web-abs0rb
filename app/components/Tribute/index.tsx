"use client";

import { useEffect, useState } from "react";

function SkeletonQuote() {
  return (
    <div className="p-8">
      <div className="h-5 bg-stone-200 rounded w-3/4 mx-auto animate-pulse mb-3" />
      <div className="h-5 bg-stone-200 rounded w-2/3 mx-auto animate-pulse" />
    </div>
  );
}

export default function Tribute() {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minDelay = 150;

    fetch("/data/quotes.json")
      .then((res) => res.json())
      .then((quotes: string[]) => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          setQuote(randomQuote);
          setIsLoading(false);
        }, remainingDelay);
      })
      .catch(() => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          setQuote("");
          setIsLoading(false);
        }, remainingDelay);
      });
  }, []);

  if (isLoading) {
    return (
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-4">
          Tribute
        </h2>
        <SkeletonQuote />
      </section>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
        Tribute
      </h2>
      <p className="font-body text-stone-700 mb-4">
        Some of the nice comments received on Discord before the game closed.
        This will refresh every time you reload.
      </p>
      <div className="py-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <svg
            className="w-8 h-8 text-stone-300 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="font-body text-base italic text-stone-600 leading-relaxed">
            {quote}
          </p>
        </div>
      </div>
    </section>
  );
}
