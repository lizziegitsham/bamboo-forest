import { NextResponse } from "next/server";
import { sendNewsletterSignupNotification, sendNewsletterWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    await Promise.all([sendNewsletterSignupNotification(email), sendNewsletterWelcomeEmail(email)]);
  } catch (error) {
    console.error("Failed to send newsletter signup emails", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
