"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type UserMapData = Record<string, number>;

export default function UserSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ username: string; id: number }>
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState("");
  const [userMapCache, setUserMapCache] = useState<Record<string, UserMapData>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFilteredSuggestions = (data: UserMapData, query: string) => {
    const lowerQuery = query.toLowerCase();
    return Object.entries(data)
      .filter(([username]) => username.toLowerCase().startsWith(lowerQuery))
      .slice(0, 5)
      .map(([username, id]) => ({ username, id }));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setError("");

    if (value.length === 0 || !/[a-z0-9]/i.test(value[0])) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const firstChar = value[0].toLowerCase();
    if (userMapCache[firstChar]) {
      setSuggestions(getFilteredSuggestions(userMapCache[firstChar], value));
      setSelectedIndex(-1);
      setIsLoading(false);
    } else {
      // Will trigger fetch in useEffect
      setIsLoading(true);
    }
  };

  // Fetch user_map data when first character is typed (only for cache misses)
  useEffect(() => {
    if (searchQuery.length === 0) {
      return;
    }

    const firstChar = searchQuery[0].toLowerCase();

    // Only fetch for alphanumeric characters
    if (!/[a-z0-9]/.test(firstChar)) {
      return;
    }

    // Skip if already cached
    if (userMapCache[firstChar]) {
      return;
    }

    // Fetch the user_map data
    fetch(`/data/user_map/${firstChar}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user map");
        return res.json();
      })
      .then((data: UserMapData) => {
        setUserMapCache((prev) => ({ ...prev, [firstChar]: data }));
        setSuggestions(getFilteredSuggestions(data, searchQuery));
        setSelectedIndex(-1);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setSuggestions([]);
      });
  }, [searchQuery, userMapCache]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a username");
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const firstChar = lowerQuery[0];

    if (!/[a-z0-9]/.test(firstChar)) {
      setError("Username must start with a letter or number");
      return;
    }

    const userData = userMapCache[firstChar];

    if (!userData) {
      setError("User not found");
      return;
    }

    const userId = userData[lowerQuery];

    if (!userId) {
      setError(`User "${searchQuery}" not found in the archive`);
      return;
    }

    router.push(`/users/${userId}`);
  };

  const handleSelectSuggestion = (username: string, id: number) => {
    router.push(`/users/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      handleSelectSuggestion(selected.username, selected.id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <main className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-body text-sm text-stone-500 hover:text-stone-700 mb-8"
        >
          <span>←</span> Back to Archive
        </Link>

        {/* Header Section */}
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl mb-4">
            User Lookup
          </h1>
          <p className="font-body text-lg text-stone-600">
            Search for any Abs0rb.me user by their username to view their stats
            and activity.
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-10">
          <div className="">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <label
                  htmlFor="username-search"
                  className="block font-heading text-sm font-semibold text-stone-900 mb-2"
                >
                  Username
                </label>

                {/* Combined control */}
                <div className="flex items-stretch gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      id="username-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter username..."
                      className="w-full rounded-lg border border-stone-300 bg-transparent px-4 py-3 font-body text-stone-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
                      autoComplete="off"
                      autoFocus
                    />

                    {/* Loading indicator (inside input area) */}
                    {isLoading && searchQuery.length > 0 && (
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600"></div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-stone-900 px-5 py-3 font-heading font-semibold text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </div>

                {/* Suggestions Dropdown (full width of row) */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full rounded-lg border border-stone-200 bg-white shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.username}
                        type="button"
                        onClick={() =>
                          handleSelectSuggestion(
                            suggestion.username,
                            suggestion.id
                          )
                        }
                        className={`w-full text-left px-4 py-3 font-body text-sm transition-colors ${
                          index === selectedIndex
                            ? "bg-stone-100 text-stone-900"
                            : "text-stone-700 hover:bg-stone-50"
                        } ${index === 0 ? "rounded-t-lg" : ""} ${
                          index === suggestions.length - 1
                            ? "rounded-b-lg"
                            : "border-b border-stone-100"
                        }`}
                      >
                        <div className="font-medium">{suggestion.username}</div>
                        <div className="text-xs text-stone-500">
                          ID: {suggestion.id}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="font-body text-sm text-red-700">{error}</p>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
