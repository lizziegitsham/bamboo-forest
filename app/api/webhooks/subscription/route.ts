import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_STATUSES = ["free", "active", "cancelled"];

// Generic integration point for flipping a student's paid-tier access —
// callable by the separate multi-vendor booking app once it exists, by
// Stripe directly, or manually today while testing. Deliberately not
// coupled to any specific payment processor's payload shape.
export async function POST(request: Request) {
  const secret = process.env.SUBSCRIPTION_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  if (request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const status = typeof body?.status === "string" ? body.status.trim() : "";

  if (!email || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Expected { email, status }" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: userList, error: lookupError } = await admin.auth.admin.listUsers();
  if (lookupError) {
    console.error("Failed to look up users for subscription webhook", lookupError);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  const user = userList.users.find((candidate) => candidate.email?.toLowerCase() === email);
  if (!user) {
    return NextResponse.json({ error: "No account found for that email" }, { status: 404 });
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({ subscription_status: status })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update subscription_status", updateError);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
