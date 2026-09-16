import type { Metadata } from "next";
import { getPrograms } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { ClassListingCard } from "@/components/layout/ClassListingCard";

export const metadata: Metadata = {
  title: "Classes",
  description: "Tai Chi classes for every level, from beginners through applied practice.",
};

const CLASS_DETAILS: Record<string, { meta: string; image?: string }> = {
  "tai-chi-improvers": {
    meta: "Thursday, 18:30 – 19:30 · Beckwithshaw Hall",
    image: "/images/tai-chi-riverside-practice.webp",
  },
  "tai-chi-push-hands": {
    meta: "Thursday, 19:30 – 20:30 · Beckwithshaw Hall",
  },
  "applied-tai-chi": {
    meta: "Saturday, 10:00 – 11:00 · Bamboo Forest Studio",
    image: "/images/escrima-staff-practice.webp",
  },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const beginners = programs.find((program) => program.slug === "beginners-tai-chi");
  const ongoing = programs.filter((program) => program.slug !== "beginners-tai-chi");

  return (
    <>
      <PageHero
        title="Harrogate Tai Chi, Kung Fu & Meditation"
        subtitle="We offer Tai Chi, Kung Fu, Asian weapons and meditation practices with professional teaching in Harrogate. Easily accessible from Knaresborough, Boroughbridge, Ripon, Pateley Bridge and everywhere in between."
        subtitleClassName="mt-8"
      />
      <section className="mx-auto max-w-5xl px-6 py-16">
        {beginners && (
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-[#5e703a]">Courses</h2>
            <div className="mt-4">
              <ClassListingCard
                title={beginners.title}
                meta="Thursday 17th September, 13:30–14:30 · Beckwithshaw Hall"
                description={beginners.summary}
                image="/images/cheng-man-ching-teaching.webp"
                imageAlt={beginners.title}
                href={`/classes/${beginners.slug}`}
              />
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-bold uppercase tracking-wide text-[#5e703a]">Classes</h2>
          <div className="mt-4 space-y-6">
            {ongoing.map((program) => {
              const details = CLASS_DETAILS[program.slug];
              return (
                <ClassListingCard
                  key={program.slug}
                  title={program.title}
                  meta={details?.meta ?? program.level}
                  description={program.summary}
                  image={details?.image}
                  imageAlt={program.title}
                  href={`/classes/${program.slug}`}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
