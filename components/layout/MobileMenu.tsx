"use client";

import { useState } from "react";
import Link from "next/link";
import { ABOUT_LINKS, PROGRAM_LINKS } from "@/lib/nav";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-black/15 hover:bg-black/5"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-5 w-5"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-40 max-h-[80vh] overflow-y-auto border-t border-black/10 bg-white px-6 py-6 shadow-lg"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Classes</p>
          <ul className="mt-2 space-y-1">
            {PROGRAM_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded px-2 py-2 text-base font-medium hover:bg-black/5"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-black/10 pt-6">
            <Link href="/timetable" onClick={close} className="block py-2 text-base font-medium">
              Timetable
            </Link>
          </div>

          <div className="mt-6 border-t border-black/10 pt-6">
            <Link href="/about" onClick={close} className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              About
            </Link>
            <ul className="mt-2 space-y-1">
              {ABOUT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="block rounded px-2 py-2 text-base font-medium hover:bg-black/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-black/10 pt-6">
            <Link href="/contact" onClick={close} className="block py-2 text-base font-medium">
              Contact
            </Link>
          </div>

          <Link
            href="/login"
            onClick={close}
            className="mt-6 block rounded-full border border-black/15 px-4 py-2.5 text-center text-sm font-medium hover:bg-black/5"
          >
            Student Login
          </Link>
        </div>
      )}
    </div>
  );
}
