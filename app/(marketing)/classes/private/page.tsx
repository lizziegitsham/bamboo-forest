import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PrivateLessonEnquiryCTA } from "@/components/layout/PrivateLessonEnquiryCTA";

export const metadata: Metadata = {
  title: "Private 1:1 Lessons",
  description: "One-to-one Tai Chi tuition, online or in-person.",
};

const BENEFITS = [
  "Fully tailored to your pace, goals and any physical considerations",
  "Flexible scheduling — daytime, evening, online or in-person",
  "Ideal alongside group classes, or as a standalone way to learn",
];

export default function PrivateLessonsPage() {
  return (
    <>
      <PageHero
        title="Private 1:1 Lessons"
        subtitle="[Placeholder] One-to-one Tai Chi tuition, built entirely around you — your pace, your goals, your schedule."
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="relative h-56 w-full overflow-hidden rounded-lg sm:h-72">
          <PlaceholderImage label="Private 1:1 Tai Chi lesson" className="h-full w-full" />
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Why go private?</h2>
        <ul className="mt-6 space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex gap-2 text-sm text-zinc-600">
              <span aria-hidden className="text-[#5e703a]">
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <PrivateLessonEnquiryCTA />
        </div>
      </section>
    </>
  );
}
