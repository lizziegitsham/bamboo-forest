import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface TrialEnrollment {
  id: string;
  class_sessions: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    programs: { title: string } | null;
    venues: { name: string } | null;
  } | null;
}

export default async function PortalDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: enrollments }, { data: outstandingForms }, { data: trial }] =
    await Promise.all([
      supabase.from("profiles").select("full_name, subscription_status").eq("id", user!.id).maybeSingle(),
      supabase
        .from("enrollments")
        .select("id, class_sessions(programs(title))")
        .eq("user_id", user!.id)
        .eq("status", "active"),
      supabase
        .from("consent_forms")
        .select("id, title, consent_records!left(id, user_id)")
        .is("consent_records.user_id", null),
      supabase
        .from("enrollments")
        .select("id, class_sessions(day_of_week, start_time, end_time, programs(title), venues(name))")
        .eq("user_id", user!.id)
        .eq("status", "trial")
        .returns<TrialEnrollment[]>()
        .maybeSingle(),
    ]);

  const isPaid = profile?.subscription_status === "active";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{user?.email}</p>
        <p className="mt-2 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-600">
          {isPaid ? "Paid member" : "Free account"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 p-6">
          <h2 className="font-semibold">Your classes</h2>
          <p className="mt-1 text-sm text-zinc-500">{enrollments?.length ?? 0} active enrollment(s)</p>
          <Link href="/portal/classes" className="mt-3 inline-block text-sm font-medium underline hover:opacity-70">
            View classes
          </Link>
        </div>
        <div className="rounded-lg border border-black/10 p-6">
          <h2 className="font-semibold">Outstanding forms</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {outstandingForms?.length ?? 0} form(s) need your signature
          </p>
          <Link href="/portal/forms" className="mt-3 inline-block text-sm font-medium underline hover:opacity-70">
            View forms
          </Link>
        </div>

        <div className="rounded-lg border border-black/10 p-6">
          <h2 className="font-semibold">Trial class</h2>
          {trial?.class_sessions ? (
            <p className="mt-1 text-sm text-zinc-500">
              Booked: {trial.class_sessions.programs?.title} — {trial.class_sessions.day_of_week}{" "}
              {trial.class_sessions.start_time}–{trial.class_sessions.end_time} at{" "}
              {trial.class_sessions.venues?.name}
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-zinc-500">You haven&apos;t booked a trial class yet.</p>
              <Link
                href="/portal/book-trial"
                className="mt-3 inline-block text-sm font-medium underline hover:opacity-70"
              >
                Book a trial class
              </Link>
            </>
          )}
        </div>

        <div className="rounded-lg border border-black/10 p-6">
          <h2 className="font-semibold">Videos</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isPaid ? "Full access to all video collections." : "Upgrade to a paid membership to unlock videos."}
          </p>
          <Link href="/portal/videos" className="mt-3 inline-block text-sm font-medium underline hover:opacity-70">
            {isPaid ? "Watch videos" : "Preview collections"}
          </Link>
        </div>
      </div>
    </div>
  );
}
