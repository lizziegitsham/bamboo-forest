import Image from "next/image";
import Link from "next/link";
import { getVenues } from "@/lib/content";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { SocialIcons } from "@/components/layout/SocialIcons";

export async function Footer() {
  const venues = await getVenues();

  return (
    <footer>
      <div className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 pt-10">
          <Image src="/logo.png" alt="Bamboo Forest Martial Arts" width={280} height={100} className="h-14 w-auto" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-10">
          <NewsletterForm />
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 border-t border-white/15 px-6 py-10 sm:grid-cols-2">
          <div>
            <p className="font-semibold">Bamboo Forest Martial Arts</p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              {venues.map((venue) => (
                <li key={venue.slug}>{venue.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Follow</p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-white/15 px-6 py-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Bamboo Forest Martial Arts
        </p>
      </div>

      <div className="bg-[#5e703a] px-6 py-8">
        <SocialIcons />
      </div>
    </footer>
  );
}
