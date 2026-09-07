import { createClient } from "@/lib/supabase/server";
import { bookTrial } from "@/app/(portal)/portal/actions";

interface ClassSession {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  programs: { title: string } | null;
  venues: { name: string } | null;
}

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

export default async function BookTrialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: existingTrial } = await supabase
    .from("enrollments")
    .select("id, class_sessions(day_of_week, start_time, end_time, programs(title), venues(name))")
    .eq("user_id", user!.id)
    .eq("status", "trial")
    .returns<TrialEnrollment[]>()
    .maybeSingle();

  if (existingTrial?.class_sessions) {
    const session = existingTrial.class_sessions;
    return (
      <div>
        <h1 className="text-2xl font-semibold">Book a Trial Class</h1>
        <div className="mt-6 rounded-lg border border-black/10 p-6">
          <p className="font-medium">You&apos;ve already booked your trial class:</p>
          <p className="mt-2 text-sm text-zinc-600">
            {session.programs?.title} — {session.day_of_week} {session.start_time}–{session.end_time} at{" "}
            {session.venues?.name}
          </p>
        </div>
      </div>
    );
  }

  const { data: sessions } = await supabase
    .from("class_sessions")
    .select("id, day_of_week, start_time, end_time, programs(title), venues(name)")
    .returns<ClassSession[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Book a Trial Class</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pick one session to try — you can only book one trial class.
      </p>

      <div className="mt-6 space-y-4">
        {sessions?.map((session) => (
          <form key={session.id} action={bookTrial.bind(null, session.id)}>
            <button
              type="submit"
              className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-black/10 p-4 text-left transition hover:border-black/30"
            >
              <span className="font-medium">{session.programs?.title}</span>
              <span className="text-sm text-zinc-500">
                {session.day_of_week} {session.start_time}–{session.end_time} · {session.venues?.name}
              </span>
            </button>
          </form>
        ))}
        {!sessions?.length && (
          <p className="text-sm text-zinc-500">No sessions are available to book right now.</p>
        )}
      </div>
    </div>
  );
}
