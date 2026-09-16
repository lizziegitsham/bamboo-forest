import Link from "next/link";
import type { Metadata } from "next";
import { getPrograms, getVenues } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { TimetableFilterableList, type ScheduleDisplayEntry } from "@/components/layout/TimetableFilterableList";

export const metadata: Metadata = {
  title: "Timetable",
  description: "Harrogate weekly class timetable, grouped by day.",
};

interface ScheduleEntry {
  day: string;
  time: string;
  className: string;
  programSlug?: string;
  venueSlug: string;
}

// TODO(phase-2): replace this static list with the `class_sessions` table
// once the Supabase backend is live, so this page and the booking system
// share one source of truth.
const SCHEDULE: ScheduleEntry[] = [
  { day: "Wednesday", time: "13:00 – 14:00", className: "Tai Chi Improvers", programSlug: "tai-chi-improvers", venueSlug: "bamboo-forest-studio" },
  { day: "Wednesday", time: "14:00 – 15:00", className: "Pushing Hands", programSlug: "tai-chi-push-hands", venueSlug: "bamboo-forest-studio" },
  { day: "Thursday", time: "14:30 – 15:30", className: "Tai Chi Fundamentals", venueSlug: "beckwithshaw-hall" },
  { day: "Thursday", time: "18:30 – 19:30", className: "Tai Chi Improvers", programSlug: "tai-chi-improvers", venueSlug: "beckwithshaw-hall" },
  { day: "Thursday", time: "19:30 – 20:30", className: "Pushing Hands", programSlug: "tai-chi-push-hands", venueSlug: "beckwithshaw-hall" },
  { day: "Friday", time: "09:15 – 10:15", className: "Qigong & Meditation", venueSlug: "beckwithshaw-hall" },
  { day: "Friday", time: "10:15 – 11:15", className: "Tai Chi Improvers", programSlug: "tai-chi-improvers", venueSlug: "beckwithshaw-hall" },
  { day: "Saturday", time: "10:00 – 11:00", className: "Applied Tai Chi", programSlug: "applied-tai-chi", venueSlug: "bamboo-forest-studio" },
  { day: "Saturday", time: "11:00 – 12:00", className: "Pushing Hands", programSlug: "tai-chi-push-hands", venueSlug: "bamboo-forest-studio" },
];

export default async function TimetablePage() {
  const [programs, venues] = await Promise.all([getPrograms(), getVenues()]);
  const programBySlug = new Map(programs.map((program) => [program.slug, program]));
  const venueBySlug = new Map(venues.map((venue) => [venue.slug, venue]));

  const entries: ScheduleDisplayEntry[] = SCHEDULE.map((entry) => {
    const venue = venueBySlug.get(entry.venueSlug);
    const program = entry.programSlug ? programBySlug.get(entry.programSlug) : undefined;
    return {
      day: entry.day,
      time: entry.time,
      className: entry.className,
      href: program ? `/classes/${program.slug}` : undefined,
      venueName: venue?.name ?? entry.venueSlug,
    };
  });

  return (
    <>
      <PageHero
        title="Harrogate Class Timetable"
        subtitle="Classes in Tai Chi ranging from form classes to applied. Tai Chi is the core of what we teach but look out for Qigong, Asian weapons, Indian Clubs and more!"
      >
        <Link
          href="/classes"
          className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
        >
          See our classes
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
        >
          Contact us
        </Link>
      </PageHero>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <TimetableFilterableList entries={entries} />
      </section>
    </>
  );
}
