"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_MENUS, type NavMenu } from "@/lib/nav";
import { MobileMenu } from "@/components/layout/MobileMenu";

function isActiveHref(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeMenu = () => setOpenMenu(null);
  const pathname = usePathname();
  const isMenuActive = (menu: NavMenu) =>
    menu.groups.some((group) => group.links.some((link) => isActiveHref(pathname, link.href)));

  useEffect(() => {
    if (!openMenu) return;

    function handlePointerDown(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  const activeMenu = NAV_MENUS.find((menu) => menu.key === openMenu) ?? null;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80" onClick={closeMenu}>
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
          {NAV_MENUS.map((menu) => (
            <button
              key={menu.key}
              type="button"
              onClick={() => setOpenMenu((current) => (current === menu.key ? null : menu.key))}
              aria-haspopup="true"
              aria-expanded={openMenu === menu.key}
              aria-current={isMenuActive(menu) ? "page" : undefined}
              className={`transition-colors hover:text-[#5e703a] ${
                openMenu === menu.key || isMenuActive(menu) ? "font-bold" : ""
              }`}
            >
              {menu.label}
            </button>
          ))}
          <Link
            href="/timetable"
            aria-current={isActiveHref(pathname, "/timetable") ? "page" : undefined}
            className={`transition-colors hover:text-[#5e703a] ${
              isActiveHref(pathname, "/timetable") ? "font-bold" : ""
            }`}
            onClick={closeMenu}
          >
            Timetable
          </Link>
          <Link
            href="/contact"
            aria-current={isActiveHref(pathname, "/contact") ? "page" : undefined}
            className={`transition-colors hover:text-[#5e703a] ${
              isActiveHref(pathname, "/contact") ? "font-bold" : ""
            }`}
            onClick={closeMenu}
          >
            Contact
          </Link>
        </nav>

        <Link
          href="/login"
          className="hidden rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium hover:bg-black/5 lg:inline-block"
          onClick={closeMenu}
        >
          Student Login
        </Link>

        <MobileMenu />
      </div>

      {activeMenu && (
        <div className="absolute inset-x-0 top-full z-40 hidden border-b border-black/10 bg-white shadow-lg lg:block">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-12 px-6 py-10">
            {activeMenu.groups.map((group) => (
              <div key={group.heading} className="w-44">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{group.heading}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="text-sm font-medium hover:opacity-70"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="ml-auto w-72 rounded-lg bg-black/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide">Need a hand?</p>
              <p className="mt-3 text-sm text-zinc-600">
                Questions about classes, venues or getting started — Paul&rsquo;s happy to help.
              </p>
              <div className="mt-5 space-y-2">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block rounded-full border border-black/15 bg-white px-4 py-2 text-center text-sm font-medium hover:bg-black/5"
                >
                  Send an Enquiry
                </Link>
                <a
                  href="mailto:paul@bambooforestmartialarts.com"
                  className="block rounded-full border border-black/15 bg-white px-4 py-2 text-center text-sm font-medium hover:bg-black/5"
                >
                  Email Paul
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
