import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getVenues, getProgram } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { BenefitsCarousel, type Benefit } from "@/components/home/BenefitsCarousel";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { ClassListingCard } from "@/components/layout/ClassListingCard";
import {
  FlexibilityIcon,
  StrengthIcon,
  BalanceIcon,
  StructureIcon,
  FocusIcon,
  RelaxationIcon,
  AwarenessIcon,
  FlowIcon,
} from "@/components/home/BenefitIcons";

export const metadata: Metadata = {
  description: "Tai Chi classes in Harrogate for all levels, from first-timers to advanced practitioners.",
};

const WHAT_WE_PRACTICE = [
  {
    title: "Applied Tai Chi",
    blurb:
      "Applied Tai Chi classes are not your regular Tai Chi classes! Learn a short form, then explore the conditioning and partner practices to develop strength, structure, relaxation and deep awareness. Tai Chi is a principle-based martial art providing a great cross-training opportunity — especially valuable as time or injury gets in the way of your regular practice.",
    image: "/images/tai-chi-riverside-practice.webp",
  },
  {
    title: "Escrima, Tai Chi Staff & Stick",
    blurb:
      "Traditional training from Pilipino Escrima, Tai Chi Staff and Chinese stick systems, with practical instruction for an engaging experience. Get fit, integrate mind and body, improve hand eye co-ordination and work towards a flow state while discovering Asia's rich cultural heritage through the mastery of the most primitive of tools.",
    image: "/images/escrima-staff-practice.webp",
  },
  {
    title: "Tai Chi, Meditation & Neigong",
    blurb:
      "Tai Chi practice and meditation, breath work and internal strength practices from a number of Asian traditions. Great for physical and mental health. Run as courses throughout the year to give you a practice to take away for life. These are not martial arts classes and focus on balance, health and fitness.",
    image: "/images/meditation-in-yorkshire-dales.webp",
  },
];

const BENEFITS: Benefit[] = [
  {
    title: "Flexibility",
    description:
      "Tai Chi's slow, controlled movements gently increase range of motion in your joints and muscles over time.",
    icon: <FlexibilityIcon />,
  },
  {
    title: "Strength",
    description:
      "Low-impact conditioning builds functional strength in the legs, core and back without heavy loading.",
    icon: <StrengthIcon />,
  },
  {
    title: "Balance",
    description: "Weight-shifting and single-leg postures sharpen balance and reduce the risk of falls.",
    icon: <BalanceIcon />,
  },
  {
    title: "Structure",
    description: "Correct alignment through the form builds a stable, resilient posture you carry into daily life.",
    icon: <StructureIcon />,
  },
  {
    title: "Focus",
    description: "The concentration needed to follow the form quietens a busy mind and sharpens attention.",
    icon: <FocusIcon />,
  },
  {
    title: "Relaxation",
    description: "Deep, unhurried breathing calms the nervous system and eases everyday tension.",
    icon: <RelaxationIcon />,
  },
  {
    title: "Awareness",
    description: "Moving mindfully builds a clearer sense of your body in space, and of those around you.",
    icon: <AwarenessIcon />,
  },
  {
    title: "Flow",
    description: "With practice, the form becomes continuous and effortless — movement without hesitation.",
    icon: <FlowIcon />,
  },
];

export default async function HomePage() {
  const [venues, beginners] = await Promise.all([getVenues(), getProgram("beginners-tai-chi")]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <section className="relative isolate overflow-hidden py-28 text-center text-white sm:py-36">
        <Image
          src="/images/dark-bamboo-forest.webp"
          alt="Bamboo forest"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/40" />
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Tai Chi, Martial Arts &amp; Meditation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-200">
            Improve relaxation, balance, strength and awareness for body and
            mind. Harrogate weekly public classes in Tai Chi. Regular Tai Chi
            beginner courses for Harrogate and the surrounding area!
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/timetable"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
            >
              See the timetable
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Book a trial class
            </Link>
          </div>
        </div>
      </section>

      {beginners && (
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-16">
          <ClassListingCard
            title="Harrogate Beginners Tai Chi"
            meta="Thursday 17th September, 13:30–14:30 · Beckwithshaw Hall"
            description={beginners.summary}
            image="/images/cheng-man-ching-teaching.webp"
            imageAlt="Harrogate Beginners Tai Chi"
          />
          <div className="mt-4 flex justify-center gap-4">
            <Link href={`/classes/${beginners.slug}`} className="text-sm font-medium underline hover:opacity-70">
              Learn more
            </Link>
            <Link href="/contact" className="text-sm font-medium underline hover:opacity-70">
              Register interest
            </Link>
          </div>
        </section>
      )}

      <section className="bg-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold">What We Practice</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {WHAT_WE_PRACTICE.map((item) => (
              <div key={item.title}>
                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{item.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-semibold">Benefits of Practice</h2>
        <div className="mt-6">
          <BenefitsCarousel benefits={BENEFITS} />
        </div>
      </section>

      <section className="bg-[#5e703a] text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold">What Students Say</h2>
          <div className="mt-6">
            <GoogleReviews />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-semibold">Where We Train</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {venues.map((venue) => (
            <Link
              key={venue.slug}
              href="/timetable"
              className="rounded-lg border border-black/10 p-6 transition hover:border-black/30"
            >
              <h3 className="font-semibold">{venue.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{venue.address}</p>
              <p className="mt-2 text-sm text-zinc-600">{venue.content}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <h2 className="text-2xl font-semibold">[Placeholder community/values statement]</h2>
        <p className="mt-3 text-zinc-600">
          [Placeholder — a short paragraph on the school&apos;s community and
          the instructor&apos;s credentials.]
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Get in touch
        </Link>
      </section>
    </>
  );
}
