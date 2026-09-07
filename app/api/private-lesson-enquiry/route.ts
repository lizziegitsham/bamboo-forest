import { NextResponse } from "next/server";
import {
  sendPrivateLessonEnquiryNotification,
  sendNewsletterSignupNotification,
  sendNewsletterWelcomeEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : undefined;
  const format = typeof body?.format === "string" ? body.format.trim() : "";
  const availability = typeof body?.availability === "string" ? body.availability.trim() : undefined;
  const message = typeof body?.message === "string" ? body.message.trim() : undefined;
  const marketingOptIn = body?.marketingOptIn === true;

  if (!name || !email || !format) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await sendPrivateLessonEnquiryNotification({ name, email, phone, format, availability, message });

    // Marketing consent is separate from — and optional alongside — the
    // enquiry itself, per an unticked-by-default opt-in checkbox.
    if (marketingOptIn) {
      await Promise.all([sendNewsletterSignupNotification(email), sendNewsletterWelcomeEmail(email)]);
    }
  } catch (error) {
    console.error("Failed to send private lesson enquiry notification", error);
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
