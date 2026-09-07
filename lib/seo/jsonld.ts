import type { Program, Venue } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bambooforestmartialarts.com";
const ORG_NAME = "Bamboo Forest Martial Arts";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: ORG_NAME,
    url: SITE_URL,
    sameAs: [] as string[],
  };
}

export function venueJsonLd(venue: Venue) {
  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: `${ORG_NAME} — ${venue.name}`,
    address: venue.address,
    parentOrganization: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
  };
}

export function courseJsonLd(program: Program) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.summary,
    provider: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
