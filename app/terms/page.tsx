import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms" />
      <section className="mx-auto max-w-3xl px-6 py-16 prose prose-zinc">
        <p className="text-sm text-zinc-500">
          [Placeholder — have this reviewed before publishing. Not legal advice.]
        </p>
        <p>
          These terms will cover class bookings, cancellations, refunds, and
          use of the student portal. Replace this section with the school&apos;s
          actual policies.
        </p>
      </section>
    </>
  );
}
