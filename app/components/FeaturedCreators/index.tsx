import videos from "@/public/data/videos/combined.json";

function getRandomVideos(count: number) {
  const shuffled = [...videos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : "";
}

export default function FeaturedCreators() {
  const selectedVideos = getRandomVideos(6);

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
        {selectedVideos.map((video, index) => {
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
