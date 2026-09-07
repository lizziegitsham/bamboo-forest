import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CorporateEnquiryCTA } from "@/components/layout/CorporateEnquiryCTA";

export const metadata: Metadata = {
  title: "Corporate Classes",
  description: "Tai Chi and wellbeing sessions for workplaces, online or in-person.",
};

const OFFERS = [
  {
    title: "Online",
    description:
      "[Placeholder] Live sessions delivered over video call, ideal for remote or distributed teams — no equipment or space needed beyond a bit of room to stand.",
    features: [
      "Delivered live over video call",
      "Works for distributed/remote teams",
      "No equipment needed",
    ],
  },
  {
    title: "In-Person",
    description:
      "[Placeholder] Sessions delivered at your workplace or one of our venues, suited to team away-days, wellbeing weeks, or a regular on-site class.",
    features: [
      "Delivered at your workplace or our venues",
      "Great for away-days and wellbeing weeks",
      "Can run as a one-off or a regular booking",
    ],
  },
];

export default function CorporateClassesPage() {
  return (
    <>
      <PageHero
        title="Corporate Classes"
        subtitle="[Placeholder] Tai Chi and mindful movement for your team — improve focus, reduce stress, and bring some calm to the working day."
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="relative h-56 w-full overflow-hidden rounded-lg sm:h-72">
          <PlaceholderImage label="Corporate Tai Chi session" className="h-full w-full" />
        </div>

        <h2 className="mt-12 text-2xl font-semibold">What We Can Offer</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {OFFERS.map((offer) => (
            <div key={offer.title} className="rounded-lg border border-black/10 p-6">
              <h3 className="text-lg font-bold text-[#5e703a]">{offer.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{offer.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden className="text-[#5e703a]">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <CorporateEnquiryCTA />
        </div>
      </section>
    </>
  );
}
