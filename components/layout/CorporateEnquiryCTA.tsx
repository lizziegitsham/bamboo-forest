"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const CTA_BG = "#5e703a";
const CTA_ACCENT = "#a9c94f";

type Status = "idle" | "loading" | "success" | "error";

export function CorporateEnquiryCTA() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("loading");
    try {
      const response = await fetch("/api/corporate-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div
        style={{ backgroundColor: CTA_BG }}
        className="grid overflow-hidden rounded-lg text-white sm:grid-cols-2"
      >
        <PlaceholderImage
          label="Corporate group session"
          className="h-56 w-full rounded-none border-0 text-white/70 sm:h-full"
        />
        <div className="flex flex-col justify-center p-8">
          <h2 className="text-2xl font-bold">Bring Tai Chi to your workplace</h2>
          <p className="mt-3 text-white/90">
            [Placeholder] Get in touch to talk through options for your team
            — we&apos;ll come back to you with a plan tailored to your
            workplace and schedule.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{ backgroundColor: CTA_ACCENT }}
            className="mt-6 w-fit rounded-full px-6 py-3 font-bold text-black transition-opacity hover:opacity-90"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="corporate-enquiry-heading"
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-lg sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 id="corporate-enquiry-heading" className="text-xl font-bold">
                Corporate Enquiry
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="shrink-0 text-zinc-500 hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="h-6 w-6"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {status === "success" ? (
              <p className="mt-6 text-sm">Thanks — we&apos;ll be in touch soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium">
                      Company name
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium">
                      Your name
                    </label>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Phone (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="attendees" className="block text-sm font-medium">
                      Number of attendees (optional)
                    </label>
                    <input
                      id="attendees"
                      name="attendees"
                      type="text"
                      inputMode="numeric"
                      className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="format" className="block text-sm font-medium">
                      Preferred format
                    </label>
                    <select
                      id="format"
                      name="format"
                      required
                      defaultValue=""
                      className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm"
                    >
                      <option value="" disabled>
                        Select…
                      </option>
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                      <option value="Either">Either</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium">
                    Anything else we should know? (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Team size, preferred dates/times, location, goals for the session…"
                    className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-600">Something went wrong — please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{ backgroundColor: CTA_BG }}
                  className="w-full rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
