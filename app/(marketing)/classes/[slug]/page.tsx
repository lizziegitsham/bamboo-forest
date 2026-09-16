import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPrograms, getProgram, getVenues } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/jsonld";
import { PageHero } from "@/components/layout/PageHero";

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata(props: PageProps<"/classes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const program = await getProgram(slug);
  if (!program) return {};
  return { title: program.title, description: program.summary };
}

export default async function ProgramPage(props: PageProps<"/classes/[slug]">) {
  const { slug } = await props.params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const venues = await getVenues();
  const programVenues = venues.filter((venue) => program.venues.includes(venue.slug));

  return (
    <>
      <JsonLd data={courseJsonLd(program)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Classes", path: "/classes" },
          { name: program.title, path: `/classes/${program.slug}` },
        ])}
      />
      <PageHero title={program.title} subtitle={program.level} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-lg text-zinc-600">{program.summary}</p>

        {programVenues.length > 0 && (
          <p className="mt-4 text-sm text-zinc-500">
            Runs at: {programVenues.map((venue) => venue.name).join(", ")}
          </p>
        )}

        <div className="prose prose-zinc mt-8 max-w-none">
          <MDXRemote source={program.content} />
        </div>
      </article>
    </>
  );
}
