import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ProgramFrontmatter {
  slug: string;
  title: string;
  level: string;
  summary: string;
  venues: string[];
  order: number;
}

export interface Program extends ProgramFrontmatter {
  content: string;
}

export interface VenueFrontmatter {
  slug: string;
  name: string;
  address: string;
  mapUrl?: string;
}

export interface Venue extends VenueFrontmatter {
  content: string;
}

async function readCollection<T>(subdir: string): Promise<(T & { content: string })[]> {
  const dir = path.join(CONTENT_DIR, subdir);
  const files = await fs.readdir(dir);
  return Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(dir, file), "utf8");
        const { data, content } = matter(raw);
        return { ...(data as T), content };
      })
  );
}

export async function getPrograms(): Promise<Program[]> {
  const programs = await readCollection<ProgramFrontmatter>("programs");
  return programs.sort((a, b) => a.order - b.order);
}

export async function getProgram(slug: string): Promise<Program | undefined> {
  const programs = await getPrograms();
  return programs.find((program) => program.slug === slug);
}

export async function getVenues(): Promise<Venue[]> {
  return readCollection<VenueFrontmatter>("venues");
}

export async function getVenue(slug: string): Promise<Venue | undefined> {
  const venues = await getVenues();
  return venues.find((venue) => venue.slug === slug);
}
