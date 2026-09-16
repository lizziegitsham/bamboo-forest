import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/ContactForm";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch or book a trial class.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" subtitle="Questions, or want to book a trial class? Send us a message." />
      <section className="mx-auto max-w-xl px-6 py-16">
        <div>
          <ContactForm />
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-black/10 pt-8">
          <PlaceholderImage label="Instructor" className="h-16 w-16 shrink-0 rounded-full" />
          <div>
            <p className="font-semibold">Or start a conversation</p>
            <a href="tel:+441000000000" className="text-sm text-zinc-600 underline hover:opacity-70">
              [Placeholder phone number]
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
