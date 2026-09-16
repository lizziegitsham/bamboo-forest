import type { Metadata } from "next";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "About Bamboo Forest Martial Arts.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="About" />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-lg text-zinc-600">
          [Placeholder — replace with the real introduction to the Bamboo
          Forest philosophy and approach to teaching Tai Chi.]
        </p>

        <h2 className="mt-12 text-2xl font-semibold">My Training</h2>
        <div className="mt-4 space-y-4 text-zinc-600">
          <p>
            [Placeholder — replace with the instructor&apos;s real background:
            years of experience, lineage/teachers, certifications, and other
            disciplines trained.]
          </p>
          <p>[Placeholder — second paragraph of instructor biography.]</p>
        </div>

        <PlaceholderImage label="Instructor demonstrating a technique" className="mt-6 h-64 w-full" />
      </article>
    </>
  );
}
