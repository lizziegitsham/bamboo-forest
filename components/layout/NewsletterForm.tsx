"use client";

import Link from "next/link";
import { useNewsletterSignup } from "@/lib/useNewsletterSignup";

export function NewsletterForm() {
  const { status, submit } = useNewsletterSignup();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    if (typeof email !== "string") return;
    const ok = await submit(email);
    if (ok) form.reset();
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold uppercase tracking-wide">Sign Up To Our Newsletter</h2>
      <p className="mt-2 text-white/90">
        Class updates, event news and timetable changes — straight to your inbox.
      </p>

      {status === "success" ? (
        <p className="mt-4 font-medium">Thanks — you&apos;re on the list.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="min-w-0 flex-1 rounded-md border border-black/10 bg-white px-4 py-3 text-black"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-md border-2 border-[#a9c94f] px-6 py-3 font-bold text-white transition-colors hover:bg-[#a9c94f] hover:text-black disabled:opacity-60"
          >
            {status === "loading" ? "Signing up…" : "Sign up"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-200">Something went wrong — please try again.</p>
      )}

      <p className="mt-4 text-xs text-white/70">
        By subscribing you agree to receive marketing emails. See how we handle your data in
        our{" "}
        <Link href="/privacy" className="font-bold underline">
          Privacy Policy
        </Link>
        . Unsubscribe any time.
      </p>
    </div>
  );
}
