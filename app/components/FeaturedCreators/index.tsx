"use client";

import { useEffect, useState } from "react";

type Video = {
  title: string;
  link: string;
  creator: string;
};

function getRandomVideos(videos: Video[], count: number) {
  const shuffled = [...videos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : "";
}

const SKELETON_COUNT = 6;

function SkeletonCard() {
  return (
    <div className="block rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="aspect-video bg-stone-200 animate-pulse" />
      <div className="p-3">
        <div className="h-4 bg-stone-200 rounded w-3/4 animate-pulse mb-2" />
        <div className="h-3 bg-stone-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

export default function FeaturedCreators() {
  const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minDelay = 150;

    fetch("/data/videos/combined.json")
      .then((res) => res.json())
      .then((videos: Video[]) => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          setSelectedVideos(getRandomVideos(videos, 6));
          setIsLoading(false);
        }, remainingDelay);
      })
      .catch(() => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          setSelectedVideos([]);
          setIsLoading(false);
        }, remainingDelay);
      });
  }, []);

  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
        Featured Creators
      </h2>
      <p className="font-body text-stone-700 mb-4">
        Honoring the content creators who shared their love for Abs0rb over the
        years. This will refresh every time you reload.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <SkeletonCard key={i} />
            ))
          : selectedVideos.map((video, index) => {
              const videoId = getVideoId(video.link);
              const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

              return (
                <a
                  key={index}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-stone-200 bg-white overflow-hidden hover:border-stone-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>

                  {/* Text content */}
                  <div className="p-3">
                    <p className="font-body text-sm text-stone-900 truncate mb-1">
                      {video.title}
                    </p>
                    <p className="font-body text-xs text-stone-600 truncate">
                      {video.creator}
                    </p>
                  </div>
                </a>
              );
            })}
      </div>
    </section>
  );
}
