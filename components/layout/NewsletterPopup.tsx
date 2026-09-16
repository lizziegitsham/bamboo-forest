"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNewsletterSignup } from "@/lib/useNewsletterSignup";

const SUBSCRIBED_KEY = "newsletter-popup-subscribed"; // localStorage: permanent, only set on signup
const SESSION_DISMISSED_KEY = "newsletter-popup-dismissed-session"; // sessionStorage: this tab/session only
const VISITED_KEY = "newsletter-popup-visited-paths";
const POPUP_BG = "#5e703a";
const POPUP_ACCENT = "#a9c94f";

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { status, submit } = useNewsletterSignup();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(SUBSCRIBED_KEY)) return;
    if (sessionStorage.getItem(SESSION_DISMISSED_KEY)) return;

    let visited: string[] = [];
    try {
      visited = JSON.parse(sessionStorage.getItem(VISITED_KEY) ?? "[]");
    } catch {
      visited = [];
    }

    if (!visited.includes(pathname)) {
      visited = [...visited, pathname];
      sessionStorage.setItem(VISITED_KEY, JSON.stringify(visited));
    }

    if (visited.length >= 2) {
      // sessionStorage has no subscribe API to hook this into instead, and
      // this only fires once per session (further nav is short-circuited by
      // SESSION_DISMISSED_KEY/SUBSCRIBED_KEY once closed), so the extra
      // render is a non-issue.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, [pathname]);

  function dismiss() {
    setOpen(false);
    // Session-only: closing without signing up should let the popup
    // reappear on the user's next visit, not suppress it forever.
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "1");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string") return;
    const ok = await submit(email);
    if (ok) {
      // Permanent: only an actual signup stops it from showing again.
      localStorage.setItem(SUBSCRIBED_KEY, "1");
      setTimeout(() => setOpen(false), 2000);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-heading"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
    >
      <div
        style={{ backgroundColor: POPUP_BG }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg p-8 text-white shadow-2xl sm:p-10"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="shrink-0 text-white/80 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <h2
          id="newsletter-popup-heading"
          className="text-center text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl"
        >
          Class Updates, Events &amp; Timetable Changes, Every Month
        </h2>

        {status === "success" ? (
          <p className="mt-8 text-center text-lg">Thanks — you&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="newsletter-popup-email" className="block font-medium">
                Email<span className="text-red-400">*</span>
              </label>
              <input
                id="newsletter-popup-email"
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-md border border-black/10 bg-zinc-50 px-3 py-2.5 text-black"
              />
            </div>

            <p className="text-sm text-white/90">
              Occasional emails with class updates, upcoming events, and
              timetable changes. We won&apos;t share your details with anyone
              else.
            </p>

            <label className="flex items-start gap-3 text-sm text-white/90">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded-sm border-black/20"
              />
              <span>
                Yes, sign me up for emails from Bamboo Forest Martial Arts.
                <span className="text-red-400">*</span>
              </span>
            </label>

            <p className="text-sm text-white/90">
              See how we handle your data in our{" "}
              <Link href="/privacy" className="font-bold underline hover:opacity-80">
                Privacy Policy
              </Link>
              . Unsubscribe any time.
            </p>

            {status === "error" && (
              <p className="text-sm text-red-300">Something went wrong — please try again.</p>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                style={{ backgroundColor: POPUP_ACCENT }}
                className="rounded-md px-8 py-3 font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "Signing up…" : "Sign me up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
