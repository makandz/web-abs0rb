"use client";

import Link from "next/link";
import UserSearch from "../components/UserSearch";

export default function UserSearchPage() {
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
          <UserSearch autoFocus showLabel />
        </section>
      </main>
    </div>
  );
}
