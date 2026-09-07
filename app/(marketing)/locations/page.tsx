import type { Metadata } from "next";
import { getVenues } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find our Tai Chi class locations in Harrogate.",
};

const LOCATION_TIMES: Record<string, string[]> = {
  "beckwithshaw-hall": ["Thursday, 19:30 – 20:30"],
  "bamboo-forest-studio": ["Wednesday, 14:00 – 15:00", "Saturday, 11:00 – 12:00"],
};

export default async function LocationsPage() {
  const venues = await getVenues();

  return (
    <>
      <PageHero title="Locations" />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-bold uppercase tracking-wide text-[#5e703a]">Location &amp; Time</h2>

        <div className="mt-6 space-y-12">
          {venues.map((venue) => (
            <div key={venue.slug} className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">{venue.name}</h3>
                <p className="mt-1 text-sm text-zinc-600">{venue.address}</p>
                <ul className="mt-4 space-y-1 text-sm font-medium text-[#5e703a]">
                  {(LOCATION_TIMES[venue.slug] ?? []).map((time) => (
                    <li key={time}>{time}</li>
                  ))}
                </ul>
              </div>
              {venue.mapUrl && (
                <div className="h-64 overflow-hidden rounded-lg border border-black/10">
                  <iframe
                    src={venue.mapUrl}
                    title={`Map of ${venue.name}`}
                    loading="lazy"
                    className="h-full w-full border-0"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
