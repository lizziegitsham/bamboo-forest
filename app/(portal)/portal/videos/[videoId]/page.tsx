import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface VideoRow {
  id: string;
  title: string;
  description: string | null;
  storage_path: string;
}

// Long enough to load and watch a session in one sitting, short enough that
// a copied/shared link is useless shortly after — the page always mints a
// fresh one on load rather than reusing a cached URL.
const SIGNED_URL_TTL_SECONDS = 60 * 10;

export default async function VideoPage(props: PageProps<"/portal/videos/[videoId]">) {
  const { videoId } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user!.id)
    .maybeSingle();

  // Defense in depth: the listing page already hides this link from
  // free-tier users, but that's a UI nicety, not access control — this
  // server-side re-check is what actually gates the video.
  if (profile?.subscription_status !== "active") {
    redirect("/portal/videos");
  }

  const { data: video } = await supabase
    .from("videos")
    .select("id, title, description, storage_path")
    .eq("id", videoId)
    .returns<VideoRow[]>()
    .maybeSingle();

  if (!video) notFound();

  const admin = createAdminClient();
  const { data: signed, error } = await admin.storage
    .from("videos")
    .createSignedUrl(video.storage_path, SIGNED_URL_TTL_SECONDS);

  if (error || !signed) {
    throw new Error("Failed to generate video URL");
  }

  return (
    <div>
      <Link href="/portal/videos" className="text-sm font-medium underline hover:opacity-70">
        ← Back to videos
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">{video.title}</h1>
      {video.description && <p className="mt-1 text-sm text-zinc-600">{video.description}</p>}
      <video key={signed.signedUrl} controls className="mt-6 w-full rounded-lg bg-black" src={signed.signedUrl} />
    </div>
  );
}
