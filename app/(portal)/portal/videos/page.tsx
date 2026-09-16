import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface Video {
  id: string;
  title: string;
  description: string | null;
}

interface Collection {
  id: string;
  title: string;
  description: string | null;
  videos: Video[];
}

export default async function VideosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: collections }] = await Promise.all([
    supabase.from("profiles").select("subscription_status").eq("id", user!.id).maybeSingle(),
    supabase
      .from("video_collections")
      .select("id, title, description, videos(id, title, description)")
      .order("sort_order")
      .returns<Collection[]>(),
  ]);

  const isPaid = profile?.subscription_status === "active";

  return (
    <div>
      <h1 className="text-2xl font-semibold">Videos</h1>

      {!isPaid && (
        <div className="mt-4 rounded-lg border border-[#5e703a] bg-[#5e703a]/5 p-4 text-sm">
          Videos are available on a paid membership.{" "}
          <Link href="/contact" className="font-medium underline hover:opacity-70">
            Get in touch to upgrade
          </Link>
          .
        </div>
      )}

      <div className="mt-8 space-y-10">
        {collections?.map((collection) => (
          <div key={collection.id}>
            <h2 className="text-lg font-semibold">{collection.title}</h2>
            {collection.description && (
              <p className="mt-1 text-sm text-zinc-500">{collection.description}</p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collection.videos.map((video) =>
                isPaid ? (
                  <Link
                    key={video.id}
                    href={`/portal/videos/${video.id}`}
                    className="rounded-lg border border-black/10 p-4 transition hover:border-black/30"
                  >
                    <p className="font-medium">{video.title}</p>
                    {video.description && (
                      <p className="mt-1 text-sm text-zinc-500">{video.description}</p>
                    )}
                  </Link>
                ) : (
                  <div
                    key={video.id}
                    aria-label={`${video.title} — locked, upgrade to watch`}
                    className="relative overflow-hidden rounded-lg border border-black/10 p-4"
                  >
                    <div aria-hidden className="blur-sm select-none">
                      <p className="font-medium">{video.title}</p>
                      {video.description && (
                        <p className="mt-1 text-sm text-zinc-500">{video.description}</p>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/70 text-sm font-medium text-zinc-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className="h-4 w-4"
                      >
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      Locked
                    </div>
                  </div>
                )
              )}
              {!collection.videos.length && (
                <p className="text-sm text-zinc-500">No videos in this collection yet.</p>
              )}
            </div>
          </div>
        ))}
        {!collections?.length && (
          <p className="text-sm text-zinc-500">No video collections have been added yet.</p>
        )}
      </div>
    </div>
  );
}
