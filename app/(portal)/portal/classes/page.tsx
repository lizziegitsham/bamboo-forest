import { createClient } from "@/lib/supabase/server";

interface Enrollment {
  id: string;
  status: string;
  class_sessions: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    programs: { title: string } | null;
    venues: { name: string } | null;
  } | null;
}

export default async function ClassesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      "id, status, class_sessions(day_of_week, start_time, end_time, programs(title), venues(name))"
    )
    .eq("user_id", user!.id)
    .returns<Enrollment[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold">My Classes</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Enrollments are managed by the school — contact us to change or add a class.
      </p>
      <div className="mt-6 space-y-4">
        {enrollments?.map((enrollment) => {
          const session = enrollment.class_sessions;
          return (
            <div key={enrollment.id} className="rounded-lg border border-black/10 p-6">
              <h2 className="font-semibold">{session?.programs?.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {session?.day_of_week} · {session?.start_time}–{session?.end_time} ·{" "}
                {session?.venues?.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                {enrollment.status}
              </p>
            </div>
          );
        })}
        {!enrollments?.length && (
          <p className="text-sm text-zinc-500">You&apos;re not enrolled in any classes yet.</p>
        )}
      </div>
    </div>
  );
}
