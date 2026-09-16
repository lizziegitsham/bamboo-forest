import { NextResponse } from "next/server";
import { sendCorporateEnquiryNotification } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const companyName = typeof body?.companyName === "string" ? body.companyName.trim() : "";
  const contactName = typeof body?.contactName === "string" ? body.contactName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : undefined;
  const attendees = typeof body?.attendees === "string" ? body.attendees.trim() : undefined;
  const format = typeof body?.format === "string" ? body.format.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : undefined;

  if (!companyName || !contactName || !email || !format) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await sendCorporateEnquiryNotification({
      companyName,
      contactName,
      email,
      phone,
      attendees,
      format,
      message,
    });
  } catch (error) {
    console.error("Failed to send corporate enquiry notification", error);
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
