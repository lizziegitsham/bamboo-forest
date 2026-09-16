# Bamboo Forest Martial Arts

Next.js rebuild of the Bamboo Forest Martial Arts website, replacing the
existing WordPress site. See `/Users/elizabethgitsham/.claude/plans/zesty-snuggling-snail.md`
for the full architecture plan and phased roadmap.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Content: MDX files in `/content`, read through `lib/content.ts`
- Auth + database (student portal): [Supabase](https://supabase.com) (Postgres + Auth + Storage, Row Level Security)
- Email: [Resend](https://resend.com) for contact form and newsletter-signup notifications
- Deployment: [Vercel](https://vercel.com)

## Getting started

```bash
yarn install
cp .env.local.example .env.local   # fill in the values described below
yarn run dev
```

The marketing site (home, classes, timetable, prices, about, contact) works
with no environment variables configured. Two features need setup:

### Contact form + newsletter signup (Resend)

1. Create a [Resend](https://resend.com) account and API key.
2. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (the owner's inbox) in `.env.local`.

Without these, the forms submit but the API route returns a 500 — nothing
crashes, but no email is sent.

### Student portal (Supabase)

1. Create a Supabase project — an EU (Frankfurt) region is recommended for UK data residency.
2. Run `supabase/schema.sql` in the project's SQL editor to create the tables and Row Level Security policies.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
4. Enrollments and consent-form definitions are managed directly in the Supabase Studio table editor for now (see the plan doc — this is deliberate for the MVP).

Without Supabase configured, `/portal/*` routes simply redirect to `/login`.

### Paid-tier videos & subscription status

Students have a `subscription_status` on their profile (`free` / `active` / `cancelled`). Free-tier students see locked/blurred video cards in `/portal/videos`; `active` students can watch.

1. Set `SUPABASE_SERVICE_ROLE_KEY` (Supabase dashboard → Project Settings → API → `service_role`) — **secret**, server-only, bypasses RLS. Used only by the video player (to mint signed Storage URLs) and the subscription webhook.
2. Upload videos to the `videos` Storage bucket (created by `schema.sql`, private) via Supabase Studio, then add matching rows to the `video_collections` and `videos` tables with the Storage path.
3. For now, flip a student's access by hand: set their `profiles.subscription_status` to `active` in Studio.
4. To flip access programmatically (e.g. once the separate multi-vendor booking app exists, or from Stripe), set `SUBSCRIPTION_WEBHOOK_SECRET` and `POST /api/webhooks/subscription` with header `X-Webhook-Secret: <that value>` and body `{ "email": "...", "status": "active" }`.

Video URLs are never permanent — the player page re-checks the student's login and subscription status on every load and mints a fresh signed URL (10 minute expiry) each time, so access always tracks their current status rather than a link that could be copied and shared.

### Booking a trial class

Any logged-in student can self-serve book one trial class from `/portal/book-trial`, picking a real session from `class_sessions`. A database-level unique index (not just app logic) enforces one trial per student.

### Live Google reviews (Places API)

The "What Students Say" section pulls real reviews from your Google Business
Profile via the official Places API (New) — no scraping, respects Google's
terms of service, and includes the required attribution.

1. In [Google Cloud Console](https://console.cloud.google.com), create/select a project and enable **Places API (New)**.
2. Create an API key restricted to Places API (New). This is used server-side only — never expose it to the browser.
3. Find your business's [Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id).
4. Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` in `.env.local`.

Without these, the section falls back to placeholder review cards. Google's
Places API (New) only returns up to 5 of the most relevant reviews for a
place — there's no way to show all reviews via this API.

## Project structure

```
app/(marketing)/   Public site: home, classes, timetable, prices, about, contact
app/(auth)/        Magic-link login + auth callback
app/(portal)/      Student portal (auth-gated)
app/privacy, app/terms   Standalone legal pages
content/           MDX content (programs, venues) — swap for a headless CMS later via lib/content.ts
lib/supabase/      Supabase client helpers (browser, server, proxy/session-refresh)
proxy.ts           Refreshes the Supabase session and gates /portal on every request
supabase/schema.sql  Database schema + RLS policies to run in Supabase
```

## Replacing placeholder content

Program descriptions, venue addresses, and pricing in `/content` and the
`prices`/`timetable` pages are marked `[Placeholder]` — nothing was copied
from the existing WordPress site. Replace them with real copy, and add real
photography via `next/image`.
