"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const emergencyContact = String(formData.get("emergency_contact") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      emergency_contact: emergencyContact,
    })
    .eq("id", user.id);

  if (error) throw error;
  revalidatePath("/portal/profile");
}

export async function signConsentForm(consentFormId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const { error } = await supabase.from("consent_records").insert({
    user_id: user.id,
    consent_form_id: consentFormId,
    ip_address: ipAddress,
  });

  if (error) throw error;
  revalidatePath("/portal/forms");
}

export async function bookTrial(classSessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // The `enrollments_one_trial_per_user` unique index is the real
  // safety net against a race (e.g. two tabs submitting at once) — this
  // is just a friendlier pre-check for the normal single-submit case.
  const { data: existingTrial } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "trial")
    .maybeSingle();

  if (existingTrial) {
    throw new Error("You've already booked a trial class");
  }

  const { error } = await supabase.from("enrollments").insert({
    user_id: user.id,
    class_session_id: classSessionId,
    status: "trial",
  });

  if (error) throw error;
  revalidatePath("/portal");
  revalidatePath("/portal/book-trial");
  revalidatePath("/portal/classes");
}
