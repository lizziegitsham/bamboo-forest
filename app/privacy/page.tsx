import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-6 py-16 prose prose-zinc">
      <p className="text-sm text-zinc-500">
        [Placeholder — have this reviewed before publishing. Not legal advice.]
      </p>

      <h2>What we collect</h2>
      <p>
        When you contact us or sign up for the student portal, we collect the
        information you provide directly: your name, email address, phone
        number, and — for enrolled students — emergency contact details and
        signed waiver/consent records.
      </p>

      <h2>Why we collect it</h2>
      <p>
        To respond to enquiries, run classes safely (emergency contacts,
        health/consent waivers), and manage your enrollment and membership.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li>Supabase — hosts our database, authentication, and file storage (EU region).</li>
        <li>Resend — sends transactional emails on our behalf.</li>
        <li>Vercel — hosts this website.</li>
      </ul>
      <p>We do not sell your data.</p>

      <h2>Your rights</h2>
      <p>
        You can ask to see the data we hold on you, correct it, or have it
        deleted, by contacting us via the <a href="/contact">contact page</a>.
      </p>

      <h2>Retention</h2>
      <p>
        We keep enrollment and consent records for as long as you&apos;re an
        active student, plus a reasonable period afterwards for legal and
        insurance purposes.
      </p>
      </section>
    </>
  );
}
