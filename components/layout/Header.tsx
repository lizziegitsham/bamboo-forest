import Image from "next/image";
import Link from "next/link";
import { ABOUT_LINKS, PROGRAM_LINKS } from "@/lib/nav";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Image
            src="/logo.png"
            alt="Bamboo Forest Martial Arts"
            width={280}
            height={100}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <div className="group relative">
            <Link href="/classes" className="transition-opacity hover:opacity-70">
              Classes
            </Link>
            <div className="invisible absolute left-0 top-full z-10 w-56 rounded-md border border-black/10 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {PROGRAM_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded px-3 py-2 hover:bg-black/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/timetable" className="transition-opacity hover:opacity-70">
            Timetable
          </Link>

          <div className="group relative">
            <Link href="/about" className="transition-opacity hover:opacity-70">
              About
            </Link>
            <div className="invisible absolute left-0 top-full z-10 w-40 rounded-md border border-black/10 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {ABOUT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded px-3 py-2 hover:bg-black/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/contact" className="transition-opacity hover:opacity-70">
            Contact
          </Link>
        </nav>

        <Link
          href="/login"
          className="hidden rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium hover:bg-black/5 lg:inline-block"
        >
          Student Login
        </Link>

        <MobileMenu />
      </div>
    </header>
  );
}
