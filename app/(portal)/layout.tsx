import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/portal/SignOutButton";

const PORTAL_NAV = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/classes", label: "My Classes" },
  { href: "/portal/book-trial", label: "Book a Trial" },
  { href: "/portal/videos", label: "Videos" },
  { href: "/portal/forms", label: "Forms" },
  { href: "/portal/profile", label: "Profile" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: proxy.ts already redirects unauthenticated /portal
  // requests, but Server Functions must not rely on that alone.
  if (!user) {
    redirect("/login?next=/portal");
  }

  return (
    <>
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
            {PORTAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:opacity-70">
                {item.label}
              </Link>
            ))}
          </nav>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </>
  );
}
